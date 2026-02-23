import * as path from 'node:path'
import * as os from 'node:os'

export type HexId = string;

export interface PciSubsystem {
  subVendorId: HexId; // 4 hex
  subDeviceId: HexId; // 4 hex
  name: string;
}

export interface PciDevice {
  id: HexId; // 4 hex
  name: string;
  subsystems: Map<string, PciSubsystem>; // key: `${subVendorId}:${subDeviceId}`
}

export interface PciVendor {
  id: HexId; // 4 hex
  name: string;
  devices: Map<string, PciDevice>; // key: deviceId
}

export interface PciProgIf {
  id: HexId; // 2 hex
  name: string;
}

export interface PciSubclass {
  id: HexId; // 2 hex
  name: string;
  progIfs: Map<string, PciProgIf>; // key: progIfId
}

export interface PciClass {
  id: HexId; // 2 hex
  name: string;
  subclasses: Map<string, PciSubclass>; // key: subclassId
}

export interface PciDbData {
  vendors: Map<string, PciVendor>; // key: vendorId
  classes: Map<string, PciClass>; // key: classId
}

export interface LoadOptions {
  url?: string;
  cacheDir?: string;
  maxAgeMs?: number; // default: 7 days
  forceRefresh?: boolean;
  timeoutMs?: number; // default: 20s
}

const DEFAULT_URL = 'https://pci-ids.ucw.cz/v2.2/pci.ids'
const DEFAULT_CACHE_SUBDIR = 'pciids'

type CacheMeta = {
  etag?: string;
  lastModified?: string;
  downloadedAt?: string; // ISO
};

function normHex(id: string, len: number): string {
  const v = id.trim().toLowerCase().replace(/^0x/, '')
  const hex = v.replace(/[^0-9a-f]/g, '')
  return hex.padStart(len, '0').slice(-len)
}

function countLeadingTabs(s: string): number {
  let i = 0
  while (i < s.length && s.charCodeAt(i) === 9) i++ // '\t'
  return i
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

async function readMeta(metaPath: string): Promise<CacheMeta | null> {
  const f = Bun.file(metaPath)
  if (!(await f.exists())) return null
  try {
    const txt = await f.text()
    return JSON.parse(txt) as CacheMeta
  } catch {
    return null
  }
}

async function writeMeta(metaPath: string, meta: CacheMeta): Promise<void> {
  await Bun.write(metaPath, JSON.stringify(meta, null, 2), { createPath: true })
}

function metaFresh(meta: CacheMeta | null, maxAgeMs: number): boolean {
  if (!meta?.downloadedAt) return false
  const t = Date.parse(meta.downloadedAt)
  if (!Number.isFinite(t)) return false
  return Date.now() - t <= maxAgeMs
}

/**
 * Ensure pci.ids exists in cache and is reasonably fresh.
 * - If fresh: return path.
 * - Else: conditional GET using ETag / Last-Modified
 * - If 304: update downloadedAt meta and return cached file
 * - If download fails but cached file exists: return cached file
 */
export async function ensurePciIdsCached(opts: LoadOptions = {}): Promise<string> {
  const url = opts.url ?? DEFAULT_URL
  const cacheDir = opts.cacheDir ?? path.join(os.tmpdir(), DEFAULT_CACHE_SUBDIR)
  const maxAgeMs = opts.maxAgeMs ?? 7 * 24 * 60 * 60 * 1000 // 7 days
  const forceRefresh = opts.forceRefresh ?? false
  const timeoutMs = opts.timeoutMs ?? 20_000

  const idsPath = path.join(cacheDir, 'pci.ids')
  const metaPath = path.join(cacheDir, 'pci.ids.meta.json')

  const idsFile = Bun.file(idsPath)
  const haveFile = await idsFile.exists()

  const meta = (await readMeta(metaPath)) ?? {}

  if (haveFile && !forceRefresh) {
    // Prefer meta freshness (so 304 revalidations "refresh" without touching the file mtime)
    if (metaFresh(meta, maxAgeMs)) return idsPath

    // Fallback: use the file's lastModified
    // (BunFile.lastModified is a UNIX timestamp for the file.) :contentReference[oaicite:1]{index=1}
    const lastMod = idsFile.lastModified || 0
    if (lastMod > 0 && Date.now() - lastMod <= maxAgeMs) return idsPath
  }

  const headers: Record<string, string> = {}
  if (meta.etag) headers['If-None-Match'] = meta.etag
  if (meta.lastModified) headers['If-Modified-Since'] = meta.lastModified

  try {
    const res = await fetchWithTimeout(url, { method: 'GET', headers }, timeoutMs)

    if (res.status === 304 && haveFile) {
      await writeMeta(metaPath, { ...meta, downloadedAt: new Date().toISOString() })
      return idsPath
    }

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

    // Stream response body straight to disk (fast + low memory).
    await Bun.write(idsPath, res, { createPath: true })

    await writeMeta(metaPath, {
      etag: res.headers.get('etag') ?? undefined,
      lastModified: res.headers.get('last-modified') ?? undefined,
      downloadedAt: new Date().toISOString(),
    })

    return idsPath
  } catch (err) {
    if (haveFile) return idsPath
    throw err
  }
}

export function parsePciIds(text: string): PciDbData {
  const vendors = new Map<string, PciVendor>()
  const classes = new Map<string, PciClass>()

  let section: 'devices' | 'classes' = 'devices'

  let curVendor: PciVendor | null = null
  let curDevice: PciDevice | null = null

  let curClass: PciClass | null = null
  let curSubclass: PciSubclass | null = null

  const lines = text.split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '')
    if (!line || line.startsWith('#')) continue

    if (line.startsWith('C ')) section = 'classes'

    if (section === 'devices') {
      const tabs = countLeadingTabs(line)

      if (tabs === 0) {
        const m = line.match(/^([0-9A-Fa-f]{4})\s+(.+)\s*$/)
        if (!m) continue
        const vid = normHex(m[1], 4)
        const name = m[2].trim()
        curVendor = { id: vid, name, devices: new Map() }
        vendors.set(vid, curVendor)
        curDevice = null
        continue
      }

      if (tabs === 1 && curVendor) {
        const trimmed = line.slice(1)
        const m = trimmed.match(/^([0-9A-Fa-f]{4})\s+(.+)\s*$/)
        if (!m) continue
        const did = normHex(m[1], 4)
        const name = m[2].trim()
        curDevice = { id: did, name, subsystems: new Map() }
        curVendor.devices.set(did, curDevice)
        continue
      }

      if (tabs >= 2 && curVendor && curDevice) {
        const trimmed = line.slice(tabs)
        const m = trimmed.match(/^([0-9A-Fa-f]{4})\s+([0-9A-Fa-f]{4})\s+(.+)\s*$/)
        if (!m) continue
        const svid = normHex(m[1], 4)
        const sdid = normHex(m[2], 4)
        const name = m[3].trim()
        curDevice.subsystems.set(`${svid}:${sdid}`, { subVendorId: svid, subDeviceId: sdid, name })
        continue
      }

      continue
    }

    // classes section
    {
      const tabs = countLeadingTabs(line)

      if (tabs === 0) {
        const m = line.match(/^C\s+([0-9A-Fa-f]{2})\s+(.+)\s*$/)
        if (!m) continue
        const cid = normHex(m[1], 2)
        const name = m[2].trim()
        curClass = { id: cid, name, subclasses: new Map() }
        classes.set(cid, curClass)
        curSubclass = null
        continue
      }

      if (tabs === 1 && curClass) {
        const trimmed = line.slice(1)
        const m = trimmed.match(/^([0-9A-Fa-f]{2})\s+(.+)\s*$/)
        if (!m) continue
        const sid = normHex(m[1], 2)
        const name = m[2].trim()
        curSubclass = { id: sid, name, progIfs: new Map() }
        curClass.subclasses.set(sid, curSubclass)
        continue
      }

      if (tabs >= 2 && curClass && curSubclass) {
        const trimmed = line.slice(tabs)
        const m = trimmed.match(/^([0-9A-Fa-f]{2})\s+(.+)\s*$/)
        if (!m) continue
        const pid = normHex(m[1], 2)
        const name = m[2].trim()
        curSubclass.progIfs.set(pid, { id: pid, name })
        continue
      }
    }
  }

  return { vendors, classes }
}

/**
 * High-level helper: downloads (if needed), reads, parses.
 */
export async function loadPciDb(opts: LoadOptions = {}): Promise<PciDb> {
  const p = await ensurePciIdsCached(opts)
  const text = await Bun.file(p).text()
  return new PciDb(parsePciIds(text))
}

/**
 * Convenience wrapper with lookup helpers.
 */
export class PciDb {
  constructor(public readonly data: PciDbData) { }

  getVendor(vendorId: string): PciVendor | undefined {
    return this.data.vendors.get(normHex(vendorId, 4))
  }

  getDevice(vendorId: string, deviceId: string): PciDevice | undefined {
    return this.getVendor(vendorId)?.devices.get(normHex(deviceId, 4))
  }

  getSubsystem(
    vendorId: string,
    deviceId: string,
    subVendorId: string,
    subDeviceId: string,
  ): PciSubsystem | undefined {
    return this.getDevice(vendorId, deviceId)?.subsystems.get(
      `${normHex(subVendorId, 4)}:${normHex(subDeviceId, 4)}`,
    )
  }

  getClass(classId: string): PciClass | undefined {
    return this.data.classes.get(normHex(classId, 2))
  }

  getSubclass(classId: string, subclassId: string): PciSubclass | undefined {
    return this.getClass(classId)?.subclasses.get(normHex(subclassId, 2))
  }

  getProgIf(classId: string, subclassId: string, progIfId: string): PciProgIf | undefined {
    return this.getSubclass(classId, subclassId)?.progIfs.get(normHex(progIfId, 2))
  }

  vendorName(vendorId: string): string | undefined {
    return this.getVendor(vendorId)?.name
  }

  deviceName(vendorId: string, deviceId: string): string | undefined {
    return this.getDevice(vendorId, deviceId)?.name
  }

  className(classId: string): string | undefined {
    return this.getClass(classId)?.name
  }
}

export const pciDb = await loadPciDb({ maxAgeMs: 24 * 60 * 60 * 1000 }) // 1 day
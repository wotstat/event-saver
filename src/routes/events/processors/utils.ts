import { pciDb } from '@/pciids/pciids'
import type { Event, BattleEvent, HangarEvent } from '@/types/utils/event'
import type { PlayerInfo } from '@/types/utils/playerInfo'
import type { DynamicBattleInfo } from '@/types/utils/battleInfo'
import type { SessionMeta } from '@/types/utils/sessionMeta'
import type { ServerInfo } from '@/types/utils/serverInfo'

export function now() {
  return Date.now() / 1000
}

export function prefixObjectKeys<K extends keyof any, T>(prefix: string, obj: Record<K, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}.${k}`, v])) as Record<string, T>
}

export function unwrapVector3(name: string, v: { x: number, y: number, z: number } | null) {
  if (v === null)
    return {
      [`${name}_x`]: null,
      [`${name}_y`]: null,
      [`${name}_z`]: null,
    }

  return {
    [`${name}_x`]: v.x,
    [`${name}_y`]: v.y,
    [`${name}_z`]: v.z,
  }
}

export function secToMs(sec: number) {
  return Math.round(sec * 1000)
}

export function unwrapEvent(e: Event) {
  return {
    region: e.region,
    gameVersion: e.gameVersion,
    modVersion: e.modVersion,
    localeTime: e.localtime,
  }
}

export function unwrapServerInfo(e: Partial<ServerInfo>) {
  return {
    serverName: e.serverName ?? '',
    serverOnline: e.serverOnline ?? 0,
    regionOnline: e.regionOnline ?? 0,
  }
}

export function unwrapPlayerInfo(e: Partial<PlayerInfo> & Pick<PlayerInfo, 'playerName'>) {
  return {
    playerName: e.playerName,
    accountDBID: e.accountDBID ?? 0,
    playerClan: e.playerClan ?? '',
    playerClanDBID: e.playerClanDBID ?? 0,
  }
}

function vendorId(gpuVendor: number) {
  switch (gpuVendor) {
    case 0: return null
    case 1: return '8086' // Intel
    case 2: return '10DE' // NVIDIA
    case 3: return '1002' // AMD
    default: return null
  }
}

const SUPPORTED_SHELLS = ['HIGH_EXPLOSIVE', 'FLAME', 'ARMOR_PIERCING_CR', 'ARMOR_PIERCING_FSDS', 'HOLLOW_CHARGE', 'ARMOR_PIERCING', 'ARMOR_PIERCING_HE', 'SMOKE'] as const
function unwrapShells(prefix: string, shells: DynamicBattleInfo['shells']) {
  const result = Object.fromEntries(SUPPORTED_SHELLS.map(shell => [shell, shells[shell] ?? 0]))
  return prefixObjectKeys(prefix, result)
}

export function unwrapDynamicBattleInfo(e: DynamicBattleInfo) {

  const gpuVendorId = vendorId(e.systemInfo.gpuVendor)
  const gpuName = gpuVendorId ? pciDb.getDevice(gpuVendorId, e.systemInfo.gpuFamily.toString(16))?.name : null

  const systemInfo = {
    ...e.systemInfo,
    gpuName: gpuName || 'Unknown',
  }

  return {
    arenaTag: e.arenaTag,
    battleMode: e.battleMode,
    battleGameplay: e.battleGameplay,
    team: e.team,
    tankTag: e.tankTag,
    tankRole: e.tankRole,
    tankType: e.tankType,
    tankLevel: e.tankLevel,
    gunTag: e.gunTag,
    allyTeamHealth: e.allyTeamHealth,
    enemyTeamHealth: e.enemyTeamHealth,
    allyTeamMaxHealth: e.allyTeamMaxHealth,
    enemyTeamMaxHealth: e.enemyTeamMaxHealth,
    allyTeamFragsCount: e.allyTeamFragsCount,
    enemyTeamFragsCount: e.enemyTeamFragsCount,
    mapsBlackList: e.mapsBlackList.map(s => s ?? ''),
    comp7SkillTag: e.comp7SkillTag,
    equipment: e.equipment.map(s => s ?? ''),
    consumables: e.consumables.map(s => s ?? ''),
    battleBooster: e.battleBooster,
    crew: e.crew.map(c => ({
      roles: c.roles,
      level: c.level,
      skills: c.skills.map(s => ({ tag: s.tag, level: s.level }))
    })),
    extra: e.extra,
    ...unwrapShells('shells', e.shells),
    ...prefixObjectKeys('systemInfo', systemInfo),
  }
}

export function unwrapSessionMeta(e: Partial<SessionMeta>) {
  const r = {
    battleStarts: e.battleStarts ?? 0,
    battleResults: e.battleResults ?? 0,
    winCount: e.winCount ?? 0,
    totalShots: e.totalShots ?? 0,
    totalShotsDamaged: e.totalShotsDamaged ?? 0,
    totalShotsHit: e.totalShotsHit ?? 0,
    lastResult: e.lastResult ?? [],
    lastDmgPlace: e.lastDmgPlace ?? [],
    lastXpPlace: e.lastXpPlace ?? [],
    startTime: e.sessionStart || 0,
    lastBattleAgo: e.lastBattleAgo ?? 0,
    startAgo: e.sessionStartAgo ?? 0
  }
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [`session.${k}`, v]))
}

export function unwrapHangarEvent(e: HangarEvent) {
  return {
    ...unwrapEvent(e),
    ...unwrapPlayerInfo(e),
    ...unwrapServerInfo(e),
    ...unwrapSessionMeta(e),
  }
}

export function unwrapBattleEvent(e: BattleEvent) {
  return {
    battleTime: secToMs(e.battleTime)
  }
}

export function snakeCaseToCamelCase(s: string) {
  return s.toLowerCase().split('_').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

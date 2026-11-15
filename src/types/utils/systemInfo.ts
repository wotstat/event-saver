import type { UInt16, UInt32, UInt64 } from './primitives'

type SystemInfo = {
  cpuName: string
  cpuVendor: UInt16
  cpuFamily: UInt32
  cpuCores: UInt16
  cpuFreq: UInt16
  cpuScore: UInt64
  workstationVendor: string

  gpuVendor: UInt16
  gpuFamily: UInt32
  gpuMemory: UInt16
  gpuDriverVersion: UInt64
  gpuScore: UInt64

  gameDriveName: string
  ramTotal: UInt32

  architectureBits: string
  architectureLinkage: string

  system: string
  machine: string
  platform: string
  version: string
  isLaptop: boolean

  windowMode: string
  nativeResolution: { refreshRate: UInt16, width: UInt16, height: UInt16 }
  windowResolution: { refreshRate: UInt16, width: UInt16, height: UInt16 }
}

export type { SystemInfo }

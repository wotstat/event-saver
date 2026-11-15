import type { UInt8 } from './primitives'

type Crewmate = {
  roles: string[]
  level: UInt8
  skills: { tag: string, level: UInt8 }[]
}

export type { Crewmate }

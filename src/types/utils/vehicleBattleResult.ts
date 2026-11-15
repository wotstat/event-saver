import type { Int32, UInt8, UInt16 } from './primitives'

type VehicleBattleResult = {
  spotted: UInt16
  mileage: UInt16
  damageAssistedTrack: UInt16
  damageReceivedFromInvisibles: UInt16
  damageReceived: UInt16
  piercingsReceived: UInt16
  directHitsReceived: UInt16
  piercingEnemyHits: UInt16
  explosionHits: UInt16
  damageAssistedRadio: UInt16
  stunDuration: number
  damageBlockedByArmor: UInt16
  damageDealt: UInt16
  xp: UInt16
  team: UInt8
  damaged: UInt16
  damageAssistedStun: UInt16
  explosionHitsReceived: UInt16
  directEnemyHits: UInt16
  stunned: UInt16
  shots: UInt16
  kills: UInt16
  lifeTime: UInt16
  tankTag: string
  tankType: 'LT' | 'MT' | 'HT' | 'SPG' | 'AT',
  tankRole: string
  tankLevel: UInt8
  killerIndex: Int32
  maxHealth: UInt16
  health: UInt16
  isAlive: boolean
  squadID: UInt8
  playerRank: UInt8
  comp7PrestigePoints: UInt16
  /** null, если навык отсутствует или не удалось его получить */
  comp7SkillTag: string | null
  /** null, если ранг не применим или не удалось его получить */
  comp7Rank: string | null
}

export type { VehicleBattleResult }

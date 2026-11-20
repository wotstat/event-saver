import type { BattleEvent } from '../utils/event'
import type { Int32, UInt8, UInt16, UInt64 } from '../utils/primitives'

type Comp7 = {
  ratingDelta: Int32,
  rating: UInt16,
  qualBattleIndex: UInt8,
  qualActive: boolean,
}

type Currencies = {
  originalCredits: Int32,
  originalGold: Int32,
  originalCrystal: Int32,
  subtotalCredits: Int32,
  autoRepairCost: Int32,
  autoLoadCredits: Int32,
  autoLoadGold: Int32,
  autoEquipCredits: Int32,
  autoEquipGold: Int32,
  autoEquipCrystals: Int32,
  piggyBank: Int32,
}

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

export interface OnBattleResult extends Omit<BattleEvent, 'battleTime'> {
  result: {
    /** id арены из танков */
    arenaID: UInt64
    isPremium: boolean,
    teamHealth: UInt16[],
    result: 'win' | 'lose' | 'tie',
    finishReason: 'UNKNOWN' | 'EXTERMINATION' | 'BASE' | 'TIMEOUT' | 'FAILURE' | 'TECHNICAL' | 'WIN_POINTS_CAP' | 'WIN_POINTS' | 'ALLY_KILLED' | 'OWN_VEHICLE_DESTROYED' | 'DESTROYED_OBJECTS' | 'OBJECTIVES_COMPLETED' | 'HB_ENEMY_EXTERMINATION' | 'HB_ALLY_SPG_EXTERMINATION' | (string & {}),
    winnerTeam: UInt16 | null,
    duration: UInt16,
    playerTeam: UInt8,
    personal: VehicleBattleResult
    playersResults: (VehicleBattleResult & {
      bdid: UInt64,
      name: string,
      clan: string,
      clanDBID: UInt64,
    })[],
    comp7: Comp7
    fortClanDBIDs: UInt64[]
    currencies: Currencies
    personalMissionsRaw: string
    personalMissions: {
      tag: string,
      conditions: {
        'tag': string,
        'state': 'NONE' | 'UNLOCKED' | 'NEED_GET_MAIN_REWARD' | 'MAIN_REWARD_GOTTEN' | 'NEED_GET_ADD_REWARD' | 'NEED_GET_ALL_REWARDS' | 'ALL_REWARDS_GOTTEN'
        'value': number | null,
        'goal': number | null,
        'battles': boolean[] | null,
      }[]
    }[]
  }
}

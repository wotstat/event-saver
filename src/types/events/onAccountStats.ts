import type { LegacyHangarEvent } from '../utils/event'
import type { DateTime, UInt32 } from '../utils/primitives'

export interface OnAccountStats extends LegacyHangarEvent {
  credits: UInt32
  gold: UInt32
  crystal: UInt32
  equipCoin: UInt32
  bpCoin: UInt32
  eventCoin: UInt32
  piggyBankCredits: UInt32
  piggyBankGold: UInt32
  freeXP: UInt32

  isPremiumPlus: boolean
  premiumPlusExpiryTime: DateTime | null

  isWotPlus: boolean
  wotPlusTier: string
  wotPlusExpiryTime: DateTime | null

  telecom: string
}

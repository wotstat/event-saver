import type { HangarEvent } from '../utils/event'
import type { UInt16, UInt64 } from '../utils/primitives'

type RaccoonRaidTaggedCount = [tag: string, count: UInt16]

/** @additionalProperties false */
interface RaccoonRaidResources {
  credits?: UInt64
  gold?: UInt64
  crystal?: UInt64
  freeXP?: UInt64
  xp?: UInt64
  tankmenXP?: UInt64
  eventCoin?: UInt64
  equipCoin?: UInt64
  bpcoin?: UInt64
  premium?: UInt16
  premium_plus?: UInt16
  premium_vip?: UInt16
  lootboxFragments?: UInt16
  slots?: UInt16
  berths?: UInt16

  currencies?: [tag: string, amount: UInt64][]
  items?: [itemTag: string, count: UInt16][]
  crewBooks?: [bookTag: string, count: UInt16][]
  boosters?: [tag: string, time: number, value: number, count: UInt16][]
  /** An empty variant denotes equipment without a variant. */
  equip?: [tag: string, count: UInt16, variant: string][]
  discounts?: [tag: string, value: number, count: UInt16][]

  lootboxesTokens?: RaccoonRaidTaggedCount[]
  lootboxKeys?: RaccoonRaidTaggedCount[]
  recruits?: RaccoonRaidTaggedCount[]
  bonusTokens?: RaccoonRaidTaggedCount[]
  entitlements?: RaccoonRaidTaggedCount[]
  customizations?: [type: string, tag: string, count: UInt16][]

  addedVehicles?: string[]
  removedVehicles?: string[]
  rentedVehicles?: [tankTag: string, rentType: string, rentValue: string][]
  /** Total amounts per tank and compensation variant, including repeated compensation. */
  compensatedVehicles?: [tankTag: string, variant: 'rent' | 'normal', amounts: Record<string, UInt64>][]
  /** Total amount per target and currency, including repeated compensation. */
  compensatedItems?: [targetType: string, targetTag: string, currency: string, amount: UInt64][]
}

type RaccoonRaidSlot =
  | [kind: 'currency', tag: 'gold' | 'credits' | 'crystal' | 'freeXP' | 'equipCoin', amount: UInt64]
  | [kind: 'item' | 'crewBook' | 'token', tag: string, count: UInt16]
  | [kind: 'booster', tag: string, time: number, value: number, count: UInt16]
  | [kind: 'equip', tag: 'demountKit' | 'recertificationForm', count: UInt16, variant: string]

export interface OnRaccoonRaidReward extends HangarEvent {
  /**
   * Unix timestamp from currentRaid, in seconds. The upper bound matches DateTime64(3) in ClickHouse 24.2.
   * @minimum 1
   * @maximum 10413791999.999
   */
  startTime: number

  /** @minimum 0 */
  durationSeconds: number

  /** @minimum 0 */
  primaryDurationSeconds: number

  /** One ingredient per slot, in the same order as raw.slots, preserving repetitions. */
  slots: [RaccoonRaidSlot, RaccoonRaidSlot, RaccoonRaidSlot]

  parsed: RaccoonRaidResources

  /** JSON object with slots (componentID and original bonus per slot) and the original claim bonus array. */
  raw: string
}

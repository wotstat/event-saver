import type { LegacyHangarEvent } from '../utils/event'
import type { UInt8, UInt16 } from '../utils/primitives'

export interface OnLootboxOpen extends LegacyHangarEvent {
  containerTag: string,
  openByTag: string,
  isOpenSuccess: boolean,
  claimed: boolean,
  rerollCount: UInt8,
  recordBoxCount: UInt16,

  openCount: UInt16,
  openGroup: string,
  parsed: {
    credits: UInt16
    gold: UInt16
    freeXP: UInt16
    crystal: UInt16
    eventCoin: UInt16
    equipCoin: UInt16
    bpcoin: UInt16

    currencies: [string, amount: UInt16][]

    premium: UInt16
    premium_plus: UInt16
    premium_vip: UInt16

    addedVehicles: string[]
    rentedVehicles: [tankTag: string, rentType: string, rentValue: string][]
    compensatedVehicles: [tankTag: string, variant: 'rent' | 'normal', gold: number][]

    slots: UInt16
    berths: UInt16

    items: [itemTag: string, count: UInt16][]
    crewBooks: [bookTag: string, count: UInt16][]

    boosters: [tag: string, time: number, value: number, count: UInt16][]
    discounts: [tag: string, value: number][]
    equip: [tag: string, count: UInt16][]

    lootboxesTokens: [tag: string, count: UInt16][]
    bonusTokens: [tag: string, count: UInt16][]
    extraTokens: [tag: string, count: UInt16][]

    customizations: [type: string, tag: string, count: UInt16][]
    blueprints: [type: 'VEHICLE' | 'NATION' | 'UNIVERSAL', specification: string, count: UInt16][]

    selectableCrewbook: [crewbookName: string][]

    toys: [toyTag: string, count: UInt16][]
    compensatedToys: [toyTag: string, compensationCurrency: string, count: UInt16][]

    entitlements: [tag: string, count: UInt16][]
  },
  raw: string
}

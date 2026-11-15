import type { Int32 } from './primitives'

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

export type { Currencies }

import type { Int32, UInt8, UInt16 } from './primitives'

type Comp7 = {
  ratingDelta: Int32,
  rating: UInt16,
  qualBattleIndex: UInt8,
  qualActive: boolean,
}

type RegularRank = 'first' | 'second' | 'third' | 'fourth'
type PrestigeRank = 'fifth' | 'sixth'
type Division = 'E' | 'D' | 'C' | 'B' | 'A'

/** WG: высшие ранги без букв; Леста: высшие дивизионы C/B/A. */
type Comp7Rank = 'qual' | RegularRank | PrestigeRank
  | `${RegularRank}_${Division}` | `${PrestigeRank}_${'C' | 'B' | 'A'}`

export type { Comp7, Comp7Rank }

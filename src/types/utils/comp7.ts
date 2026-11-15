import type { Int32, UInt8, UInt16 } from './primitives'

type Comp7 = {
  ratingDelta: Int32,
  rating: UInt16,
  qualBattleIndex: UInt8,
  qualActive: boolean,
}

type Comp7Rank = 'qual' | 'fifth' | 'sixth'
  | `${'first' | 'second' | 'third' | 'fourth'}_${'E' | 'D' | 'C' | 'B' | 'A'}`
  | `${'fifth' | 'sixth'}_${'C' | 'B' | 'A'}`

export type { Comp7, Comp7Rank }

import type { HangarEvent } from '../utils/event'
import type { UInt32 } from '../utils/primitives'

type RegularRank = 'first' | 'second' | 'third' | 'fourth'
type PrestigeRank = 'fifth' | 'sixth'
type Division = 'E' | 'D' | 'C' | 'B' | 'A'

/** WG: высшие ранги без букв; Леста: высшие дивизионы C/B/A. */
type Comp7Rank = 'qual' | RegularRank | PrestigeRank
  | `${RegularRank}_${Division}` | `${PrestigeRank}_${'C' | 'B' | 'A'}`

export interface OnComp7Info extends HangarEvent {
  /** Сезон Натиска */
  season: string

  /** Текущий рейтинг */
  rating: UInt32

  /** Точный ранг и дивизион игрока на момент события */
  rank: Comp7Rank

  /** Место в таблице лидеров */
  leaderboardPosition: UInt32 | null,
}

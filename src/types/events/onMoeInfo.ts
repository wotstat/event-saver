import type { LegacyHangarEvent } from '../utils/event'
import type { UInt32 } from '../utils/primitives'

export interface OnMoeInfo extends LegacyHangarEvent {
  /** Тег танка */
  tankTag: string

  /** количество боёв */
  battleCount: UInt32

  /** планка на отметку 0%, 20%, 40%, 55%, 65%, 75%, 85%, 95%, 100% */
  moeDistribution: [number, number, number, number, number, number, number, number, number]
}

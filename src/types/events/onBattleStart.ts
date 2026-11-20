import type { BattleEvent } from '../utils/event'
import type { Int32, UInt64, Vector3 } from '../utils/primitives'

export interface OnBattleStart extends Omit<BattleEvent, 'token'> {
  /** id арены из танков */
  arenaID: UInt64

  /** координата спавна */
  spawnPoint: Vector3

  /** Момент входа в бой */
  battlePeriod: 'IDLE' | 'WAITING' | 'PREBATTLE' | 'BATTLE' | 'AFTERBATTLE'

  /** Время в загрузки карты */
  loadTime: number

  /** Время в ожидания начала боя после загрузки  */
  preBattleWaitTime: number

  /** Время в очереди перед началом боя */
  inQueueWaitTime: number

  gameplayMask: Int32

}

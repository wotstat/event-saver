import type { UInt64 } from './primitives'

interface PlayerInfo {
  /** ID аккаунта */
  accountDBID: UInt64

  /** Ник игрока */
  playerName: string

  /** Тег клана; пустая строка, если игрок без клана */
  playerClan: string

  /** ID клана; 0, если игрок без клана */
  playerClanDBID: UInt64
}

export type { PlayerInfo }

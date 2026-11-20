import type { PlayerInfo } from './playerInfo'
import type { DynamicBattleInfo } from './battleInfo'
import type { SessionMeta } from './sessionMeta'
import type { ServerInfo } from './serverInfo'

interface Event {
  /** название ивента */
  eventName: string

  /** время события у игрока */
  localtime: string

  /** регион игры */
  region: string

  /** версия игры */
  gameVersion: string

  /** версия мода */
  modVersion: string
}

interface HangarEvent extends Event, PlayerInfo, ServerInfo, SessionMeta { }

// TODO: Удалить когда 1.6.4.2 устареет
interface LegacyHangarEvent extends Event, Partial<PlayerInfo>, Partial<ServerInfo>, Partial<SessionMeta> {
  playerName: PlayerInfo['playerName']
}

interface BattleEvent extends Event, DynamicBattleInfo, PlayerInfo, ServerInfo, SessionMeta {
  token: string

  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

export type { Event, HangarEvent, LegacyHangarEvent, BattleEvent }

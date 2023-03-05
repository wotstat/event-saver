export interface Event {
  eventName: string
  token: string
}

/** @asType integer */
declare type integer = number
declare type Vector3 = { x: number, y: number, z: number }

export interface OnBattleStart extends Event {
  /** id арены из танков */
  arenaID: integer

  /** название карты */
  arenaTag: string

  /** команда игрока */
  team: integer

  /** ник игрока */
  playerName: string

  /** WG accountDBID */
  playerDBID: integer

  /** клан игрока */
  playerClan: string

  /** название танка */
  tankTag: string

  /** типа танка */
  tankType: string

  /** уровень танка */
  tankLevel: integer

  /** название пушки */
  gunTag: string

  /** разброс на момент старта боя */
  startDis: number

  /** координата спавна */
  spawnPoint: Vector3

  /** тип боя */
  battleMode: string

  /** режим игры */
  battleGameplay: 'ctf' | 'domination' | 'assault' | 'nations' | 'ctf2' | 'domination2' | 'assault2' | 'fallout' | 'fallout2' | 'fallout3' | 'fallout4' | 'ctf30x30' | 'domination30x30' | 'sandbox' | 'bootcamp' | 'epic'

  /** название сервера */
  serverName: string

  /** регион игры */
  region: string

  /** версия игры */
  gameVersion: string

  /** версия мода */
  modVersion: string

  /** Момент входа в бой */
  battlePeriod: 'IDLE' | 'WAITING' | 'PREBATTLE' | 'BATTLE' | 'AFTERBATTLE'

  /** Время в бою относительно начала игры */
  battleTime: integer

  /** Время в загрузки карты */
  loadTime: integer

  /** Время в ожидания начала боя после загрузки  */
  preBattleWaitTime: integer

  /** Время в очереди перед началом боя */
  inQueueWaitTime: integer
  gameplayMask: integer
}

export interface OnBattleResult extends Event {
  raw: string;

  /** результат боя */
  result: 'lose' | 'win'

  /** количество кредитов за бой */
  credits: number

  /** количество опыта за бой */
  xp: number

  /** длительность боя в мс */
  duration: number

  /** количество ботов в бою 
   * @minimum 0
  */
  botsCount: number
}

export interface OnShot extends Event {
}

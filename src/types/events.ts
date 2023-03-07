/** @asType integer */
declare type integer = number
/** @minimum 0*/
declare type UInt = integer
declare type Vector3 = { x: number, y: number, z: number }

interface Event {
  eventName: string
  token: string
}

interface BattleEvent extends Event {
  /** Время в бою относительно начала игры */
  battleTime: integer
}

// Статические данные о бое (не изменяются), присутствуют во всех событиях для удобных селектов и фильтров
interface StaticBattleInfo {

  /** название карты */
  arenaTag: string

  /** ник игрока */
  playerName: string

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
}

// Динамические данные о бое (могут изменяться во время боя), присутствуют во всех событиях для удобных селектов и фильтров
interface DynamicBattleInfo extends StaticBattleInfo {

  /** команда игрока */
  team: integer

  /** название танка */
  tankTag: string

  /** типа танка */
  tankType: string

  /** уровень танка */
  tankLevel: integer

  /** название пушки */
  gunTag: string

}

export interface OnBattleStart extends DynamicBattleInfo {
  /** Время в бою относительно начала игры */
  battleTime: integer

  /** id арены из танков */
  arenaID: integer

  /** id игрока из танков, нужен для прддержания уникальной сесии */
  playerWotID: UInt

  /** координата спавна */
  spawnPoint: Vector3

  /** версия мода */
  modVersion: string

  /** Момент входа в бой */
  battlePeriod: 'IDLE' | 'WAITING' | 'PREBATTLE' | 'BATTLE' | 'AFTERBATTLE'

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

export interface OnShot extends BattleEvent, DynamicBattleInfo {
  shellTag: string
  shellName: string,
  shellDamage: number,
  shellPiercingPower: number,
  shellCaliber: integer,
  shellSpeed: number,
  shellMaxDistance: integer,
  gunDispersion: number,
  battleDispersion: number,
  serverShotDispersion: number,
  clientShotDispersion: number,
  gravity: number,
  hitReason: 'tank' | 'terrain' | 'other',
  serverAim: boolean,
  autoAim: boolean,
  ping: integer,
  battleTimeMS: integer,
  fps: integer,
  hitVehicleDescr: integer,
  hitChassisDescr: integer,
  hitTurretDescr: integer,
  hitGunDescr: integer,
  hitSegment: integer,
  hitTurretYaw: number,
  hitTurretPitch: number,
  vehicleDescr: integer,
  chassisDescr: integer,
  turretDescr: integer,
  gunDescr: integer,
  shellDescr: integer,
  turretYaw: number,
  turretPitch: number,
  vehicleSpeed: number,
  turretSpeed: number,
  gunPoint: Vector3,
  clientMarkerPoint: Vector3,
  serverMarkerPoint: Vector3,
  tracerStart: Vector3,
  tracerEnd: Vector3,
  tracerVel: Vector3,
  HitPoint?: Vector3,
  results: {
    order: integer,
    tankTag: string,
    shotDamage: number,
    fireDamage: number,
    shotHealth: number,
    fireHealth: number,
    flags: integer,
    ammoBayDestroyed: boolean,
  }[],
}


export { Event }

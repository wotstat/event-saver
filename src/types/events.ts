/** @asType integer */
declare type integer = number
/** @minimum 0*/
declare type UInt32 = integer
/** @minimum 0*/
declare type UInt64 = integer
/** @minimum 0*/
declare type UInt16 = integer
declare type Vector3 = { x: number, y: number, z: number }

interface EventWithoutToken {
  localtime: string
  eventName: string
}


interface Event extends EventWithoutToken {
  token: string
}

interface BattleEvent extends Event {
  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

// Статические данные о бое (не изменяются), присутствуют во всех событиях для удобных селектов и фильтров
interface StaticBattleInfo {

  /** название карты */
  arenaTag: string

  /** ник игрока */
  playerName: string

  /** клан игрока */
  playerClan: string

  /** тип боя */
  battleMode: string

  /** режим игры */
  battleGameplay: 'ctf' | 'domination' | 'assault' | 'nations' | 'ctf2' | 'domination2' | 'assault2' | 'fallout' | 'fallout2' | 'fallout3' | 'fallout4' | 'ctf30x30' | 'domination30x30' | 'sandbox' | 'bootcamp' | 'epic' | 'maps_training' | 'rts' | 'rts_1x1' | 'rts_bootcamp' | 'comp7'

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
  gunTag: string,

  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

export interface OnBattleStart extends DynamicBattleInfo, EventWithoutToken {
  /** id арены из танков */
  arenaID: UInt64

  /** id игрока из танков, нужен для прддержания уникальной сесии */
  playerWotID: UInt32

  /** координата спавна */
  spawnPoint: Vector3

  /** версия мода */
  modVersion: string

  /** Момент входа в бой */
  battlePeriod: 'IDLE' | 'WAITING' | 'PREBATTLE' | 'BATTLE' | 'AFTERBATTLE'

  /** Время в загрузки карты */
  loadTime: number

  /** Время в ожидания начала боя после загрузки  */
  preBattleWaitTime: number

  /** Время в очереди перед началом боя */
  inQueueWaitTime: number

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
  /** id выстрела уникальный для клиента */
  shotId: number,

  /** Тег снаряда (ARMOR_PIERCING...) */
  shellTag: string
  /**   */
  shellName: string,

  /** Средний урон снаряда */
  shellDamage: number,
  /** Среднее пробитие снаряда */
  shellPiercingPower: number,
  /** Калибр снаряда */
  shellCaliber: UInt16,
  /** Скорость снаряла по ттх */
  shellSpeed: number,
  /** Максимальная дистанци полёта снаряда */
  shellMaxDistance: integer,

  /** Разброс орудия с учётом временных бафов (например оглушение) */
  gunDispersion: number,
  /** Разброс орудия по ттх без временных бафов, но с учётом оборудования */
  battleDispersion: number,
  /** Серверное сведение */
  serverShotDispersion: number,
  /** Клиентское сведение */
  clientShotDispersion: number,
  /** Гравитация */
  gravity: number,
  /** Используется ли серверный прицел */
  serverAim: boolean,
  /** Используется автоприцел */
  autoAim: boolean,
  /** Пинг */
  ping: number,
  /** Частота кадров */
  fps: integer,

  // Параметры попадания
  /** ID корпуса танка по которому попал снаряд */
  hitVehicleDescr: integer | null,
  /** ID ходовой танка по которому попал снаряд */
  hitChassisDescr: integer | null,
  /** ID башни танка по которому попал снаряд */
  hitTurretDescr: integer | null,
  /** ID пушки танка по которому попал снаряд */
  hitGunDescr: integer | null,
  /** Yaw башни танка по которому попал снаряд */
  hitTurretYaw: number | null,
  /** Pitch башни танка по которому попал снаряд */
  hitTurretPitch: number | null,
  /** ID корпуса своего танка */
  vehicleDescr: integer,
  /** ID ходовой своего танка */
  chassisDescr: integer,
  /** ID башни своего танка */
  turretDescr: integer,
  /** ID пушки своего танка */
  gunDescr: integer,
  /** Yaw башни совего танка  */
  turretYaw: number,
  /** Pitch башни совего танка */
  turretPitch: number,
  /** ID снаряда */
  shellDescr: integer,
  /** Первый элемент массива `points` [Vehicle.showDamageFromShot](https://github.com/StranikS-Scan/WorldOfTanks-Decompiled/blob/ed9c58eecc460df6f293c60202f0f1ba26e65ab0/source/res/scripts/client/Vehicle.py#L349) */
  hitSegment: string | null,

  /** Скорость танка в момент выстрела */
  vehicleSpeed: number,
  /** Скорость вращения танков в момент выстрела */
  vehicleRotationSpeed: number,
  /** Скорость вращения башни в момент выстрела */
  turretSpeed: number,
  /** Координата пушки */
  gunPoint: Vector3,
  /** Координата клиентского маркера */
  clientMarkerPoint: Vector3,
  /** Координата серверного маркера */
  serverMarkerPoint: Vector3,
  /** Координата старта трассера */
  tracerStart: Vector3,
  /** Координата конца трассера */
  tracerEnd: Vector3,
  /** Вектор начальной скорости трассера */
  tracerVel: Vector3,

  /** Причина попадания (tank, terrain, other, none) */
  hitReason: 'tank' | 'terrain' | 'other' | 'none' | null,
  /** Координата попадания */
  hitPoint: Vector3 | null,

  /** Результаты попадания */
  results: {
    /** Очерёдность попадания */
    order: integer,
    /** Тег танка по которому попал */
    tankTag: string,
    /** Урон выстрелом */
    shotDamage: UInt16,
    /** Урон огнём */
    fireDamage: UInt16,
    /** ХП противника оставшееся после выстрела */
    shotHealth: UInt16 | null,
    /** ХП противника оставшееся после пожара */
    fireHealth: UInt16 | null,
    /** Был ли взрыв БК */
    ammoBayDestroyed: boolean,
    /** Флаги попадания [VEHICLE_HIT_FLAGS](https://github.com/StranikS-Scan/WorldOfTanks-Decompiled/blob/a301bd7678d1c9c1d618fdaa87fba91447989e91/source/res/scripts/common/constants.py#L1145)                        */
    flags: UInt16,
  }[],
}


export { Event, BattleEvent, DynamicBattleInfo, StaticBattleInfo }

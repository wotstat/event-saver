/** @asType integer */
declare type integer = number
/** @minimum 0*/
declare type UInt32 = integer
/** @minimum 0*/
declare type UInt64 = integer
/** @minimum 0*/
declare type UInt16 = integer
/** @minimum 0*/
declare type UInt8 = integer
declare type Vector3 = { x: number, y: number, z: number }

declare type AllowUndefined<T> = T | undefined


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

interface TokenEvent extends Event {
  token: string
}

interface BattleEvent extends TokenEvent {
  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

interface HangarEvent extends Event {
  /** ник игрока */
  playerName: string
}

interface SessionMeta {
  /** Количество начатых боёв */
  sessionStart: string
  /** сколько времени назад началась сессия */
  sessionStartAgo: number
  /** сколько времени назад начался прошлый бой */
  lastBattleAgo: number
  /** Количество начатых боёв */
  battleStarts: number
  /** Количество результатов */
  battleResults: number
  /** Число побед из результатов */
  winCount: number
  /** Количество выстрелов */
  totalShots: number
  /** Количество выстрелов с уроном */
  totalShotsDamaged: number
  /** Количество попавших выстрелов */
  totalShotsHit: number

  /** Последние 10 результатов это победы */
  lastResult: ('win' | 'lose' | 'tie')[]
  /** Место в топе по урону за последние 10 результатов */
  lastDmgPlace: number[]
  /** Место в топе по опыту за последние 10 результатов */
  lastXpPlace: number[]
}

interface PartialSessionMeta extends Partial<SessionMeta> { }

// Статические данные о бое (не изменяются), присутствуют во всех событиях для удобных селектов и фильтров
interface StaticBattleInfo {

  /** название карты */
  arenaTag: string

  /** ID аккаунта */
  accountDBID: UInt64

  /** клан игрока */
  playerClan: string

  /** тип боя */
  battleMode: string

  /** режим игры */
  battleGameplay: string

  /** название сервера */
  serverName: string

  /** ник игрока */
  playerName: string

}

// Динамические данные о бое (могут изменяться во время боя), присутствуют во всех событиях для удобных селектов и фильтров
interface DynamicBattleInfo extends StaticBattleInfo {

  /** команда игрока */
  team: integer

  /** название танка */
  tankTag: string

  /** типа танка */
  tankType: string

  /** роль танка */
  tankRole: string

  /** уровень танка */
  tankLevel: integer

  /** название пушки */
  gunTag: string,

  /** ХП союзной команды */
  allyTeamHealth: UInt8

  /** ХП вражеской команды */
  enemyTeamHealth: UInt8

  /** Максимальное ХП союзной команды */
  allyTeamMaxHealth: UInt8

  /** Максимальное ХП вражеской команды */
  enemyTeamMaxHealth: UInt8

  /** Количество фрагов союзников */
  allyTeamFragsCount: UInt8

  /** Количество фрагов врагов */
  enemyTeamFragsCount: UInt8
}

export interface OnBattleStart extends DynamicBattleInfo, Event, PartialSessionMeta {
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

  gameplayMask: integer

  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

type VehicleBattleResult = {
  spotted: UInt16
  mileage: UInt16
  damageAssistedTrack: UInt16
  damageReceivedFromInvisibles: UInt16
  damageReceived: UInt16
  piercingsReceived: UInt16
  directHitsReceived: UInt16
  piercingEnemyHits: UInt16
  explosionHits: UInt16
  damageAssistedRadio: UInt16
  stunDuration: number
  damageBlockedByArmor: UInt16
  damageDealt: UInt16
  xp: UInt16
  team: UInt8
  damaged: UInt16
  damageAssistedStun: UInt16
  explosionHitsReceived: UInt16
  directEnemyHits: UInt16
  stunned: UInt16
  shots: UInt16
  kills: UInt16
  lifeTime: UInt16
  tankTag: string
  tankType: 'LT' | 'MT' | 'HT' | 'SPG' | 'AT',
  tankRole: string
  tankLevel: UInt8
  killerIndex: integer
  maxHealth: UInt16
  health: UInt16
  isAlive: boolean
  squadID: UInt8
  playerRank?: UInt8
}

export interface OnBattleResult extends TokenEvent, DynamicBattleInfo, PartialSessionMeta {
  result: {
    /** id арены из танков */
    arenaID: AllowUndefined<UInt64>
    credits: integer,
    originalCredits: integer,
    teamHealth: UInt16[],
    result: 'win' | 'lose' | 'tie',
    winnerTeam: UInt16 | null,
    duration: UInt16,
    playerTeam: UInt8,
    personal: VehicleBattleResult
    playersResults: (VehicleBattleResult & {
      bdid: UInt64,
      name: string,
    })[]
  }
}

export interface OnShot extends BattleEvent, DynamicBattleInfo, PartialSessionMeta {
  /** id выстрела уникальный для клиента */
  shotId: number,

  /** ХП игрока в момент выстрела */
  health: UInt16,

  /** Тип снаряда */
  shellTag: string
  /**   */
  shellName: string,

  /** Средний урон снаряда */
  shellDamage: number,
  /** Разброс урона снаряда +-25 */
  damageRandomization: number,
  /** Среднее пробитие снаряда */
  shellPiercingPower: number,
  /** Калибр снаряда */
  shellCaliber: number,
  /** Скорость снаряла по ттх */
  shellSpeed: number,
  /** Максимальная дистанци полёта снаряда */
  shellMaxDistance: UInt16,

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
  fps: UInt16,

  // Параметры попадания
  /** ID корпуса танка по которому попал снаряд */
  hitVehicleDescr: UInt32 | null,
  /** ID ходовой танка по которому попал снаряд */
  hitChassisDescr: UInt32 | null,
  /** ID башни танка по которому попал снаряд */
  hitTurretDescr: UInt32 | null,
  /** ID пушки танка по которому попал снаряд */
  hitGunDescr: UInt32 | null,
  /** Yaw башни танка по которому попал снаряд */
  hitTurretYaw: number | null,
  /** Pitch башни танка по которому попал снаряд */
  hitTurretPitch: number | null,
  /** ID корпуса своего танка */
  vehicleDescr: UInt32,
  /** ID ходовой своего танка */
  chassisDescr: UInt32,
  /** ID башни своего танка */
  turretDescr: UInt32,
  /** ID пушки своего танка */
  gunDescr: UInt32,
  /** Yaw башни совего танка  */
  turretYaw: number,
  /** Pitch башни совего танка */
  turretPitch: number,
  /** ID снаряда */
  shellDescr: UInt32,
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
    order: UInt16,
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
    flags: UInt32,
  }[],
}

export interface OnLootboxOpen extends HangarEvent, SessionMeta {
  containerTag: string,
  openByTag?: string,
  isOpenSuccess?: boolean,
  claimed?: boolean,
  rerollCount?: UInt8,

  openCount: UInt16,
  openGroup: string,
  parsed: {
    credits: UInt16
    gold: UInt16
    freeXP: UInt16
    crystal: UInt16
    eventCoin: UInt16
    bpcoin: UInt16
    currencies: [string, amount: UInt16][]

    premium: UInt16
    premium_plus: UInt16
    premium_vip: UInt16

    addedVehicles: string[]
    rentedVehicles: [tankTag: string, rentType: string, rentValue: string][]
    compensatedVehicles: [tankTag: string, variant: 'rent' | 'normal', gold: number][]

    slots: UInt16
    berths: UInt16

    items: [itemTag: string, count: UInt16][]
    crewBooks: [bookTag: string, count: UInt16][]

    boosters: [tag: string, time: number, value: number, count: UInt16][]
    discounts: [tag: string, value: number][]
    equip: [tag: string, count: UInt16][]

    lootboxesTokens: [tag: string, count: UInt16][]
    bonusTokens: [tag: string, count: UInt16][]
    extraTokens?: [tag: string, count: UInt16][]

    customizations: [type: string, tag: string, count: UInt16][]
    blueprints: [type: 'VEHICLE' | 'NATION' | 'UNIVERSAL', specification: string, count: UInt16][]

    selectableCrewbook: [crewbookName: string][]

    toys?: [toyTag: string, count: UInt16][]
  },
  raw: string
}


export type { Event, TokenEvent, HangarEvent, BattleEvent, SessionMeta, DynamicBattleInfo, StaticBattleInfo }

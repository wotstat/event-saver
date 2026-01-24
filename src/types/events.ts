/** @asType integer */
declare type Int32 = number
/** @minimum 0*/
declare type UInt32 = Int32
/** @minimum 0*/
declare type UInt64 = Int32
/** @minimum 0*/
declare type UInt16 = Int32
/** @minimum 0*/
declare type UInt8 = Int32
declare type Vector3 = { x: number, y: number, z: number }

/** @format iso-date-time */
declare type DateTime = string

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

interface ServerInfo {
  /** название сервера */
  serverName?: string

  /** онлайн на сервере */
  serverOnline?: number

  /** онлайн в регионе */
  regionOnline?: number
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

  /** ник игрока */
  playerName: string

  /** список заблокированных карт */
  mapsBlackList?: (string | null)[]

}

// Дополнительная информация внутри боя
interface BattleExtra {
  extra?: {
    bob?: BOB25Extra
  }
}

type SystemInfo = {
  cpuName: string
  cpuVendor: string
  cpuFamily: UInt32
  cpuCores: UInt16
  cpuFreq: UInt16
  cpuScore: UInt16

  gpuFamily: string
  gpuMemory: UInt16
  gpuDriverVersion: string
  gpuScore: UInt32

  gameDriveName: string
  ramTotal: UInt32

  architectureBits: string
  architectureLinkage: string

  system: string
  machine: string
  platform: string
  version: string
  isLaptop: boolean

  windowMode: string
  nativeResolution: { refreshRate: UInt16, width: UInt16, height: UInt16 }
  windowResolution: { refreshRate: UInt16, width: UInt16, height: UInt16 }
}

// Динамические данные о бое (могут изменяться во время боя), присутствуют во всех событиях для удобных селектов и фильтров
interface DynamicBattleInfo extends StaticBattleInfo, BattleExtra {

  /** команда игрока */
  team: Int32

  /** название танка */
  tankTag: string

  /** типа танка */
  tankType: string

  /** роль танка */
  tankRole: string

  /** уровень танка */
  tankLevel: Int32

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

  /** Информация о системе */
  systemInfo?: SystemInfo
}

type BOB25Stats = { [key in '1' | '2' | '3' | '4']?: { score: number, rank: number } }
type BOB25Extra = {
  allySkill: string
  enemySkill: string
  allyBloggerId: number
  enemyBloggerId: number

  personalLevel: number,

  stats: BOB25Stats
} | {
  stats: BOB25Stats
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
  killerIndex: Int32
  maxHealth: UInt16
  health: UInt16
  isAlive: boolean
  squadID: UInt8
  playerRank?: UInt8
  comp7PrestigePoints?: UInt16
}

export interface OnBattleStart extends DynamicBattleInfo, Event, PartialSessionMeta, ServerInfo {
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

  /** Время относительно начала боя. Если событие до старта, время отрицательно */
  battleTime: number
}

type Currencies = {
  originalCredits: Int32,
  originalCrystal: Int32,
  subtotalCredits: Int32,
  autoRepairCost: Int32,
  autoLoadCredits: Int32,
  autoLoadGold: Int32,
  autoEquipCredits: Int32,
  autoEquipGold: Int32,
  autoEquipCrystals: Int32,
  piggyBank: Int32,
}

type Comp7 = {
  ratingDelta: Int32,
  rating: UInt16,
  qualBattleIndex: UInt8,
  qualActive: boolean,
}

export interface OnBattleResult extends TokenEvent, DynamicBattleInfo, PartialSessionMeta, ServerInfo {
  result: {
    /** id арены из танков */
    arenaID: AllowUndefined<UInt64>
    /** deprecated */
    credits?: Int32,
    /** deprecated */
    originalCredits?: Int32,
    isPremium?: boolean,
    teamHealth: UInt16[],
    result: 'win' | 'lose' | 'tie',
    finishReason?: 'UNKNOWN' | 'EXTERMINATION' | 'BASE' | 'TIMEOUT' | 'FAILURE' | 'TECHNICAL' | 'WIN_POINTS_CAP' | 'WIN_POINTS' | 'ALLY_KILLED' | 'OWN_VEHICLE_DESTROYED' | 'DESTROYED_OBJECTS' | 'OBJECTIVES_COMPLETED',
    winnerTeam: UInt16 | null,
    duration: UInt16,
    playerTeam: UInt8,
    personal: VehicleBattleResult
    playersResults: (VehicleBattleResult & {
      bdid: UInt64,
      name: string,
    })[],
    comp7?: Comp7
    currencies?: Currencies
    personalMissionsRaw?: string
    personalMissions?: {
      tag: string,
      conditions: {
        'tag': string,
        'state': 'NONE' | 'UNLOCKED' | 'NEED_GET_MAIN_REWARD' | 'MAIN_REWARD_GOTTEN' | 'NEED_GET_ADD_REWARD' | 'NEED_GET_ALL_REWARDS' | 'ALL_REWARDS_GOTTEN'
        'value': number | null,
        'goal': number | null,
        'battles': boolean[] | null,
      }[]
    }[]
  }
}

export interface OnShot extends BattleEvent, DynamicBattleInfo, PartialSessionMeta, ServerInfo {
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

  // TODO: Force acceleration after 1.28 update
  /** Гравитация */
  gravity?: number,
  /** Ускорение */
  acceleration?: Vector3,

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

export interface OnLootboxOpen extends HangarEvent, SessionMeta, ServerInfo {
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
    equipCoin: UInt16
    bpcoin: UInt16

    currencies?: [string, amount: UInt16][]

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
    compensatedToys?: [toyTag: string, compensationCurrency: string, count: UInt16][]

    entitlements?: [tag: string, count: UInt16][]
  },
  raw: string
}

export interface OnComp7Info extends HangarEvent {
  /** Сезон Натиска */
  season: string

  /** Текущий рейтинг */
  rating: UInt32

  /** Планка для Легенды */
  eliteRating: UInt32

  /** Место в таблице лидеров */
  leaderboardPosition?: UInt32 | null,
}

export interface OnMoeInfo extends HangarEvent {
  /** Тег танка */
  tankTag: string

  /** количество боёв */
  battleCount: UInt32

  /** планка на отметку 0%, 20%, 40%, 55%, 65%, 75%, 85%, 95%, 100% */
  moeDistribution: [number, number, number, number, number, number, number, number, number]
}

export interface OnAccountStats extends HangarEvent {
  credits: UInt32
  gold: UInt32
  crystal: UInt32
  equipCoin: UInt32
  bpCoin: UInt32
  eventCoin: UInt32
  piggyBankCredits: UInt32
  piggyBankGold: UInt32
  freeXP: UInt32

  isPremiumPlus: boolean
  premiumPlusExpiryTime: DateTime | null

  isWotPlus: boolean
  wotPlusExpiryTime: DateTime | null

  telecom: string
}


export type { Event, TokenEvent, HangarEvent, BattleEvent, SessionMeta, DynamicBattleInfo, StaticBattleInfo, ServerInfo }

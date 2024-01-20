import type { MigrationData } from "../migration";
import { dynamicBattleInfo, shellTag, tankType } from "../shared";


const hitReason = `Enum('tank', 'terrain', 'other', 'none')`

const Event_OnShot = `
create table if not exists Event_OnShot
(
    id                          UInt128               comment 'Id события',
    onBattleStartId             UInt128               comment 'Id события начала боя',
    localtime                   DateTime64(3)         comment 'Время события у клиента',
    dateTime                    DateTime64(3)         comment 'Время события на сервере',
    shotId                      UInt32                comment 'Id выстрела из танков',
  ${dynamicBattleInfo},
    battleTime                  Int32                 comment 'Время относительно начала боя в мс',
    shellTag                  ${shellTag}             comment 'Тип снаряда',
    shellName                   String                comment 'Название снаряда',
    shellDamage                 Decimal32(1)          comment 'Средний снаряда',
    shellPiercingPower          Decimal32(1)          comment 'Среднее пробитие снаряда',
    shellCaliber                Float32               comment 'Калибр снаряда',
    shellSpeed                  UInt16                comment 'Скорость снаряда',
    shellMaxDistance            UInt16                comment 'Максимальная дистанция полета снаряда',
    gunDispersion               Float32               comment 'Актуальный разброс орудия на момент выстрела (например с учётом стана)',
    battleDispersion            Float32               comment 'Разброс орудия на момент старта боя',
    serverShotDispersion        Float32               comment 'Сведение орудия на момент выстрела по серверному прицелу',
    clientShotDispersion        Float32               comment 'Сведение орудия на момент выстрела по клиентскому прицелу',
    ballisticResultServer_r     Float32               comment 'Расстояние от серверного маркера до точки попадания',
    ballisticResultServer_theta Float32               comment 'Угол между осью X и вектором от серверного маркера до точки попадания',
    ballisticResultClient_r     Float32               comment 'Расстояние от клиентского маркера до точки попадания',
    ballisticResultClient_theta Float32               comment 'Угол между осью X и вектором от клиентского маркера до точки попадания',
    gravity                     Float32               comment 'Гравитация',
    serverAim                   Bool                  comment 'Использовался ли серверный прицел',
    autoAim                     Bool                  comment 'Использовался ли автоприцел',
    ping                        Float32               comment 'Пинг',
    fps                         UInt16                comment 'ФПС',
    hitVehicleDescr             Nullable(UInt32)      comment 'Дескриптор танка, в который попал снаряд',
    hitChassisDescr             Nullable(UInt32)      comment 'Дескриптор шасси танка, в который попал снаряд',
    hitTurretDescr              Nullable(UInt32)      comment 'Дескриптор башни танка, в который попал снаряд',
    hitGunDescr                 Nullable(UInt32)      comment 'Дескриптор орудия танка, в который попал снаряд',
    hitTurretYaw                Nullable(Float32)     comment 'Угол поворота башни танка, в который попал снаряд',
    hitTurretPitch              Nullable(Float32)     comment 'Угол наклона башни танка, в который попал снаряд',
    vehicleDescr                UInt32                comment 'Дескриптор своего танка',
    chassisDescr                UInt32                comment 'Дескриптор шасси своего танка',
    turretDescr                 UInt32                comment 'Дескриптор башни своего танка',
    gunDescr                    UInt32                comment 'Дескриптор орудия своего танка',
    turretYaw                   Float32               comment 'Угол поворота башни своего танка',
    turretPitch                 Float32               comment 'Угол наклона башни своего танка',
    shellDescr                  UInt32                comment 'Дескриптор снаряда',
    hitSegment                  Nullable(String)      comment 'Сегмент, в который попал снаряд',
    vehicleSpeed                Float32               comment 'Скорость своего танка',
    vehicleRotationSpeed        Float32               comment 'Скорость поворота своего танка',
    turretSpeed                 Float32               comment 'Скорость поворота башни своего танка',
    gunPoint_x                  Float32               comment 'Координата X точки выстрела',
    gunPoint_y                  Float32               comment 'Координата Y точки выстрела',
    gunPoint_z                  Float32               comment 'Координата Z точки выстрела',
    clientMarkerPoint_x         Float32               comment 'Координата X клиентского маркера',
    clientMarkerPoint_y         Float32               comment 'Координата Y клиентского маркера',
    clientMarkerPoint_z         Float32               comment 'Координата Z клиентского маркера',
    serverMarkerPoint_x         Float32               comment 'Координата X серверного маркера',
    serverMarkerPoint_y         Float32               comment 'Координата Y серверного маркера',
    serverMarkerPoint_z         Float32               comment 'Координата Z серверного маркера',
    tracerStart_x               Float32               comment 'Координата X начала трассера',
    tracerStart_y               Float32               comment 'Координата Y начала трассера',
    tracerStart_z               Float32               comment 'Координата Z начала трассера',
    tracerEnd_x                 Float32               comment 'Координата X конца трассера',
    tracerEnd_y                 Float32               comment 'Координата Y конца трассера',
    tracerEnd_z                 Float32               comment 'Координата Z конца трассера',
    tracerVel_x                 Float32               comment 'Скорость трассера по X',
    tracerVel_y                 Float32               comment 'Скорость трассера по Y',
    tracerVel_z                 Float32               comment 'Скорость трассера по Z',
    hitReason                 ${hitReason}            comment 'Причина завершения полета снаряда',
    hitPoint_x                  Nullable(Float32) default NULL comment 'Координата X точки попадания',
    hitPoint_y                  Nullable(Float32) default NULL comment 'Координата Y точки попадания',
    hitPoint_z                  Nullable(Float32) default NULL comment 'Координата Z точки попадания',
    results                     Nested
    (
      order             UInt16,
      tankTag           String,
      shotDamage        UInt16,
      fireDamage        UInt16,
      shotHealth        Nullable(UInt16),
      fireHealth        Nullable(UInt16),
      ammoBayDestroyed  Bool,
      flags             UInt16
    ) comment 'Результаты выстрела по танкам. order - номер попадания, tankTag - тег танка, в который попал снаряд, shotDamage - урон от выстрела, fireDamage - урон от огня, shotHealth - здоровье танка после выстрела, fireHealth - здоровье танка после огня, ammoBayDestroyed - взрыв бк, flags - флаги попадания (из них можно понять например крит)',
) engine MergeTree()
      order by dateTime;
`

const VehicleBattleResult = `
  spotted             UInt16,
  mileage             UInt16,
  damageAssistedTrack UInt16,
  damageReceivedFromInvisibles UInt16,
  damageReceived      UInt16,
  piercingsReceived   UInt16,
  directHitsReceived  UInt16,
  piercingEnemyHits   UInt16,
  explosionHits       UInt16,
  damageAssistedRadio UInt16,
  stunDuration        Float32,
  damageBlockedByArmor UInt16,
  damageDealt         UInt16,
  xp                  UInt16,
  team                UInt8,
  damaged             UInt16,
  damageAssistedStun  UInt16,
  explosionHitsReceived UInt16,
  directEnemyHits     UInt16,
  stunned             UInt16,
  shots               UInt16,
  kills               UInt16,
  lifeTime            UInt16,
  tankTag             String,
  tankType          ${tankType},
  tankLevel           UInt8`


const Event_OnBattleResult = `
create table if not exists Event_OnBattleResult (
  id                UInt128           comment 'Id события',
  onBattleStartId   UInt128           comment 'Id события начала боя',
  dateTime          DateTime64        comment 'Время события на сервере',
  result            Enum8('lose' = 0, 'win' = 1, 'tie' = 2) comment 'Результат боя',
  credits           Int32             comment 'Заработанные кредиты',
  originalCredits   Int32             comment 'Заработанные кредиты без према и прочего',
  duration          UInt16            comment 'Длительность боя в секундах',
  teamHealth        Array(UInt16)     comment 'Здоровье команд',
  winnerTeam        UInt16            comment 'Победившая команда',
  playerTeam        UInt8             comment 'Команда игрока',
${dynamicBattleInfo},
  playersResults    Nested
  (
    ${VehicleBattleResult},
    bdid UInt64,
    name String
  ) comment 'Результаты игроков',
  ${VehicleBattleResult.split(',\n')
    .map(t => t.trim())
    .map(t => `"personal.${t.split(' ')[0]}" ${t.split(' ').splice(1).join(' ')}`).join(',\n')}
) engine MergeTree() order by id;
`
const Event_OnBattleStart = `
create table if not exists Event_OnBattleStart (
  id                UInt128       comment 'Id события',
  dateTime          DateTime64(3) comment 'Время события на сервере' codec (DoubleDelta),
  battleTime        Int32         comment 'Время относительно начала боя в мс',
  arenaId           UInt64        comment 'Id арены',
  gameplayMask      UInt32        comment 'Маска режимов игры (хз зачем нужно)',
  loadBattlePeriod  Enum('other', 'IDLE', 'WAITING', 'PREBATTLE', 'BATTLE', 'AFTERBATTLE') comment 'Стадия боя в момент прогрузки',
  inQueueWaitTime   UInt32        comment 'Время в очереди перед началом боя в мс',
  loadTime          UInt32        comment 'Время в загрузки карты в мс',
  preBattleWaitTime UInt32        comment 'Время в ожидания начала боя после загрузки в мс',
  ${dynamicBattleInfo},

  spawnPoint_x      Float32       comment 'Координата X точки спавна',
  spawnPoint_y      Float32       comment 'Координата Y точки спавна',
  spawnPoint_z      Float32       comment 'Координата Z точки спавна',

) engine MergeTree() order by id;
`

export default {
  name: "1",
  up: `
  drop table if exists Event_OnBattleStart;
  drop table if exists Event_OnShot;
  drop table if exists Event_OnBattleResult;

  ${Event_OnBattleStart}

  ${Event_OnShot}

  ${Event_OnBattleResult}
  `,
  down: `
  `
} as MigrationData
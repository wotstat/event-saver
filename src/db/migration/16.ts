import type { MigrationData } from "../migration";

export default {
  name: "16",
  up: `
  create table Event_OnLootboxOpen
    (
        id               UInt128                  COMMENT 'Id события',
        dateTime         DateTime64(3)            COMMENT 'Время события на сервере',
        playerName       String                   COMMENT 'Ник игрока',
        containerTag     LowCardinality(String)   COMMENT 'Тег контейнера',
        openCount        UInt16                   COMMENT 'Количество контейнеров в этом открытие',
        openGroup        String                   COMMENT 'Id открытия кейсов, если открывали например по 10',
      \`session.startTime\`         DateTime64(3)   comment 'Дата начала сессии по локальному времени клиента',
      \`session.startAgo\`          UInt32          comment 'Время в секундах со старта сессии',
      \`session.lastBattleAgo\`     UInt32          comment 'Время в секундах со старта прошлого боя',
      \`session.battleStarts\`      UInt32          comment 'Число начатых за сессию боёв',
      \`session.battleResults\`     UInt32          comment 'Число результатов',
      \`session.winCount\`          UInt32          comment 'Число побед из результатов',
      \`session.totalShots\`        UInt32          comment 'Число выстрелов',
      \`session.totalShotsDamaged\` UInt32          comment 'Число выстрелов с уроном',
      \`session.totalShotsHit\`     UInt32          comment 'Число попавших по танкам',
      \`session.lastResult\`        Array(Enum8('win', 'lose', 'tie')) comment 'Результаты за прошлые 10 боёв (победа/поражение/ничья)',
      \`session.lastXpPlace\`       Array(UInt8)    comment 'Место в команде по опыту за последние 10 результатов',
      \`session.lastDmgPlace\`      Array(UInt8)    comment 'Место в команде по урону за последние 10 результатов',
        raw              JSON                     COMMENT 'Сырые данные события',
        credits          UInt32                   COMMENT 'Кредиты',
        gold             UInt32                   COMMENT 'Золото',
        freeXP           UInt32                   COMMENT 'Свободный опыт',
        crystal          UInt32                   COMMENT 'Кристаллы',
        eventCoin        UInt32                   COMMENT 'Монеты ивента',
        bpcoin           UInt32                   COMMENT 'БП коины',
      \`currencies.tag\`    Array(String)           COMMENT 'Теги дополнительных валют',
      \`currencies.amount\` Array(UInt32)           COMMENT 'Количество дополнительных валют',
        premium          UInt32                   COMMENT 'Премиум',
        premiumPlus      UInt32                   COMMENT 'Премиум плюс',
        premiumVip       UInt32                   COMMENT 'Премиум вип',
        addedVehicles    Array(String)            COMMENT 'Добавленные танки',
      \`rentedVehicles.tag\`       Array(String)    COMMENT 'Теги арендных танков',
      \`rentedVehicles.rentType\`  Array(String)    COMMENT 'Тип аренды',
      \`rentedVehicles.rentValue\` Array(UInt32)    COMMENT 'Время аренды',
        slots              UInt32                   COMMENT 'Слоты',
        berths             UInt32                   COMMENT 'Койки в казарме',
      \`items.tag\`        Array(String)            COMMENT 'Теги предметов',
      \`items.count\`      Array(UInt32)            COMMENT 'Количество предметов',
      \`crewBooks.tag\`    Array(String)            COMMENT 'Теги книг экипажа',
      \`crewBooks.count\`  Array(UInt32)            COMMENT 'Количество книг экипажа',
      \`boosters.tag\`     Array(String)            COMMENT 'Теги бустеров',
      \`boosters.time\`    Array(UInt32)            COMMENT 'Время действия бустеров',
      \`boosters.value\`   Array(UInt32)            COMMENT 'Значение бустеров',
      \`boosters.count\`   Array(UInt32)            COMMENT 'Количество бустеров',
      \`discounts.tag\`    Array(String)            COMMENT 'Теги танков для которых скидка',
      \`discounts.value\`  Array(UInt32)            COMMENT 'Значение скидок',
      \`equip.tag\`        Array(String)            COMMENT 'Теги экипировки',
      \`equip.count\`      Array(UInt32)            COMMENT 'Количество экипировки',
      \`lootboxes.tag\`    Array(String)            COMMENT 'Теги контейнеров',
      \`lootboxes.count\`  Array(UInt32)            COMMENT 'Количество контейнеров',
      \`bonus.tag\`        Array(String)            COMMENT 'Теги бонусов Х3 и Х5 опытов',
      \`bonus.count\`      Array(UInt32)            COMMENT 'Количество бонусов',
      \`customizations.type\`    Array(String)      COMMENT 'Типы кастомизаций',
      \`customizations.tag\`     Array(String)      COMMENT 'Теги кастомизаций',
      \`customizations.count\`   Array(UInt32)      COMMENT 'Количество кастомизаций',
      \`blueprints.type\`        Array(String)      COMMENT 'Типы чертежей',
      \`blueprints.specification\` Array(String)    COMMENT 'Спецификации чертежей (нация или танк)',
      \`blueprints.count\`       Array(UInt32)      COMMENT 'Количество чертежей',
        selectableCrewbook       Array(String)      COMMENT 'Выбираемая книга экипажа'       
    )
    ENGINE = MergeTree
    PARTITION BY toYYYYMM(dateTime)
    ORDER BY (playerName, containerTag, openGroup, id, sipHash64(id))
    SAMPLE BY sipHash64(id)
  `,
  down: `
  `
} as MigrationData
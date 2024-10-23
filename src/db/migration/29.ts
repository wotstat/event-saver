import type { MigrationData } from "../migration";

export default {
  name: "29",
  up: `
    alter table Event_OnLootboxOpen add column claimed Bool default True comment 'Было ли содержимое контейнера забрано пользователем. Или заменено на другое';
    alter table Event_OnLootboxOpen add column rerollCount UInt8 default 0 comment 'Количество замен';
  `,
  down: `
  `
} as MigrationData

import type { MigrationData } from "../migration";

export default {
  name: "9",
  up: `
  create table if not exists TankList
  (
      tag         String comment 'Название (тег)',
      type        String comment 'Тип',
      level       UInt8  comment 'Уровень',
      nation      String comment 'Нация',
      iconUrl     String comment 'URL до иконки танка',
      nameRU      String comment 'Название танка на русском языке',
      shortNameRU String comment 'Короткое название танка на русском языке'
  ) engine MergeTree() order by tag;
  `,
  down: `
  `
} as MigrationData
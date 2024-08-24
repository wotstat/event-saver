import type { MigrationData } from "../migration";

export default {
  name: "26",
  up: `
    alter table Event_OnLootboxOpen
      add column if not exists openByTag LowCardinality(String) default containerTag after containerTag;

    alter table Event_OnLootboxOpen
      add column if not exists isOpenSuccess boolean default true after openByTag;
  `,
  down: `
  `
} as MigrationData
import { MigrationData } from "../migration.js";

export default {
  name: "1",
  up: `
    create table if not exists OnBattleStart (
      id String,
      date DateTime64,
      battleId String,
    ) engine MergeTree() order by id;
  `,
  down: `
    drop table if exists OnBattleStart;
  `
} as MigrationData

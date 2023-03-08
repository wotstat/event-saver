import { MigrationData } from "../migration.js";

export default {
  name: "2",
  up: `
    create table if not exists Event_OnBattleResult (
      id UInt128,
      onBattleStartId UInt128,
      dateTime DateTime64,
      reason String,
      durationMs UInt32,
      credits UInt32,
      xp UInt32,
      botsCount UInt32,
      result Enum8('lose' = 0, 'win' = 1)
    ) engine MergeTree() order by id;
  `,
  down: `
    drop table if exists Event_OnBattleResult;
  `
} as MigrationData

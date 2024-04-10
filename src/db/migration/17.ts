import type { MigrationData } from "../migration";

export default {
  name: "17",
  up: `
  alter table Event_OnShot add index bloom_id id type bloom_filter;
  alter table Event_OnShot materialize index bloom_id;

  alter table Event_OnShot add index bloom_battleStartId onBattleStartId type bloom_filter;
  alter table Event_OnShot materialize index bloom_battleStartId;
  `,
  down: `
  `
} as MigrationData
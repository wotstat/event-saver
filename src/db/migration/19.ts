import type { MigrationData } from "../migration";


export default {
  name: "19",
  up: `
  ALTER TABLE Event_OnBattleStart RENAME COLUMN allyTramFragsCount TO allyTeamFragsCount;
  ALTER TABLE Event_OnBattleResult RENAME COLUMN allyTramFragsCount TO allyTeamFragsCount;
  ALTER TABLE Event_OnShot RENAME COLUMN allyTramFragsCount TO allyTeamFragsCount;
  `,
  down: `
  `
} as MigrationData
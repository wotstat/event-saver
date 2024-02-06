import type { MigrationData } from "../migration";

export default {
  name: "5",
  up: `
  alter table Event_OnBattleResult alter column playersResults.tankType type Array(LowCardinality (String));
  alter table Event_OnBattleResult alter column playersResults.tankTag type Array(LowCardinality (String));
  `,
  down: ``
} as MigrationData


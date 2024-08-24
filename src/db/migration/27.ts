import type { MigrationData } from "../migration";

export default {
  name: "27",
  up: `
    alter table Event_OnBattleResult add column if not exists
      \`personal.brPlace\` UInt8 default 0 comment 'Место в стальном охотнике' after \`personal.squadID\`;

    alter table Event_OnBattleResult add column if not exists
      \`playersResults.brPlace\` Array(UInt8) comment 'Место в стальном охотнике' after  \`playersResults.name\`;
  `,
  down: `
  `
} as MigrationData
import type { MigrationData } from "../migration";

export default {
  name: "28",
  up: `

    alter table Event_OnBattleResult drop column if exists \`playersResults.brPlace\`;
    alter table Event_OnBattleResult drop column if exists \`personal.brPlace\`;

    alter table Event_OnBattleResult add column if not exists
      \`personal.playerRank\` UInt8 default 0 comment 'Место в стальном охотнике' after \`personal.squadID\`;

    alter table Event_OnBattleResult add column if not exists
      \`playersResults.playerRank\` Array(UInt8) comment 'Место в стальном охотнике' after  \`playersResults.name\`;
  `,
  down: `
  `
} as MigrationData
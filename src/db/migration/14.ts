import type { MigrationData } from "../migration";

function dynamic(table: string) {
  return `
    alter table ${table} add column tankRole            LowCardinality(String) comment 'Роль танка';
    alter table ${table} add column allyTeamHealth      UInt16 comment 'ХП союзной команды';
    alter table ${table} add column enemyTeamHealth     UInt16 comment 'ХП вражеской команды';
    alter table ${table} add column allyTeamMaxHealth   UInt16 comment 'Максимальное ХП союзной команды';
    alter table ${table} add column enemyTeamMaxHealth  UInt16 comment 'Максимальное ХП вражеской команды';
    alter table ${table} add column allyTramFragsCount  UInt8 comment 'Количество фрагов союзников';
    alter table ${table} add column enemyTeamFragsCount UInt8 comment 'Количество фрагов врагов';
  `
}

export default {
  name: "14",
  up: `
  ${dynamic('Event_OnBattleStart')}
  ${dynamic('Event_OnBattleResult')}
  ${dynamic('Event_OnShot')}

  alter table Event_OnBattleResult add column personal.tankRole       LowCardinality(String) comment 'Роль танка';
  alter table Event_OnBattleResult add column playersResults.tankRole LowCardinality(String) comment 'Роль танка';
  
  `,
  down: `
  `
} as MigrationData
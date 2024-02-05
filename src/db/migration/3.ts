import type { MigrationData } from "../migration";

function getShared(table: string) {
  return `
  alter table ${table} alter column arenaTag         type LowCardinality (String);
  alter table ${table} alter column battleMode       type LowCardinality (String);
  alter table ${table} alter column battleGameplay   type LowCardinality (String);
  alter table ${table} alter column tankTag          type LowCardinality (String);
  alter table ${table} alter column tankType         type LowCardinality (String);
  alter table ${table} alter column serverName       type LowCardinality (String);
  alter table ${table} alter column region           type LowCardinality (String);
  alter table ${table} alter column gameVersion      type LowCardinality (String);
  alter table ${table} alter column modVersion       type LowCardinality (String);
  alter table ${table} alter column gunTag           type LowCardinality (String);
`
}

const mutate = `
${getShared('Event_OnBattleStart')}
${getShared('Event_OnBattleResult')}
${getShared('Event_OnShot')}

alter table Event_OnBattleResult alter column personal.tankType         type LowCardinality (String);
alter table Event_OnBattleResult alter column personal.tankTag          type LowCardinality (String);
alter table Event_OnBattleResult alter column playersResults.tankType   type LowCardinality (String);
alter table Event_OnBattleResult alter column playersResults.tankTag    type LowCardinality (String);

alter table Event_OnBattleResult add column personal.squadID UInt8        comment 'Id взвода игрока. 0 - не взвод' after \`personal.isAlive\`;
alter table Event_OnBattleResult add column playersResults.squadID Array(UInt8) after \`playersResults.isAlive\`;

alter table Event_OnBattleResult update \`playersResults.squadID\` = arrayWithConstant(length(\`playersResults.name\`), toUInt8(0)) where true;


alter table Event_OnShot alter column shellTag         type LowCardinality (String);
alter table Event_OnShot alter column shellName        type LowCardinality (String);
alter table Event_OnShot alter column \`results.tankTag\` type Array(LowCardinality(String));
`

export default {
  name: "3",
  up: mutate,
  down: ``
} as MigrationData


import type { MigrationData } from "../migration";

export default {
  name: "21",
  up: `
  alter table Event_OnBattleResult
  add projection type_count (
      with length(playersResults.tankType) as tankCount
      select avg(ltCount / tankCount) as LT,
             avg(htCount / tankCount) as HT,
             avg(mtCount / tankCount) as MT,
             avg(atCount / tankCount) as AT,
             avg(spgCount / tankCount) as SPG
      group by battleMode, battleGameplay, tankLevel, tankType, tankTag);
  
  alter table Event_OnBattleResult materialize projection type_count;


  create materialized view Event_OnShot_health_damage_mv
  engine AggregatingMergeTree
  order by (battleMode, battleGameplay, tankLevel, tankType, tankTag, healthEnough)
  populate as
  select
      battleMode, battleGameplay, tankLevel, tankType, tankTag,
      assumeNotNull(a.1) as healthEnough, countState() as count
  from Event_OnShot
  array join arrayZip(results.shotHealth, results.shotDamage) as a
  where a.2 > 0 and healthEnough between 0 and 100
  group by healthEnough, battleMode, battleGameplay, tankLevel, tankType, tankTag;

  `,
  down: `
  `
} as MigrationData
import type { MigrationData } from "../migration";

export default {
  name: "22",
  up: `
  create materialized view if not exists Event_OnShot_safe_damage_count_by_base_mv
  engine AggregatingMergeTree
  order by (battleMode, battleGameplay, tankLevel, tankType, tankTag, shellDamage, shellTag, gunTag)
  populate as
  select
      battleMode, battleGameplay, tankLevel, tankType, tankTag,
      shellDamage, shellTag, gunTag,
      countState() as count
  from Event_OnShot
  array join results.shotDamage as dmg,
             results.shotHealth as health
  where dmg > 0
    and health > 0
    and (dmg + health) > round(shellDamage * 1.250001)
  group by battleMode, battleGameplay, tankLevel, tankType, tankTag, shellDamage, shellTag, gunTag;


  alter table Event_OnLootboxOpen
  add projection if not exists containerCount (
    select count()
    group by containerTag, playerName
  );

  alter table Event_OnLootboxOpen materialize projection containerCount;
  `,
  down: `
  `
} as MigrationData
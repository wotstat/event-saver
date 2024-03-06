import type { MigrationData } from "../migration";

export default {
  name: "8",
  up: `
create table Event_OnShot_new as Event_OnShot engine = MergeTree()
  order by (battleMode, playerName, tankLevel, tankType, arenaTag, onBattleStartId, id, sipHash64(id))
  sample by sipHash64(id)
  partition by toYYYYMM(dateTime);

insert into Event_OnShot_new select * from Event_OnShot;
drop table Event_OnShot;
rename table Event_OnShot_new to Event_OnShot;



create table Event_OnBattleStart_new as Event_OnBattleStart engine MergeTree()
  order by (battleMode, playerName, tankLevel, tankType, arenaTag, id, sipHash64(id))
  sample by sipHash64(id)
  partition by toYYYYMM(dateTime);

insert into Event_OnBattleStart_new select * from Event_OnBattleStart;
drop table Event_OnBattleStart;
rename table Event_OnBattleStart_new to Event_OnBattleStart;



create table Event_OnBattleResult_new as Event_OnBattleResult engine MergeTree()
  order by (battleMode, playerName, tankLevel, tankType, arenaTag, id, sipHash64(id))
  sample by sipHash64(id)
  partition by toYYYYMM(dateTime);

insert into Event_OnBattleResult_new select * from Event_OnBattleResult;
drop table Event_OnBattleResult;
rename table Event_OnBattleResult_new to Event_OnBattleResult;
  `,
  down: `
  `
} as MigrationData
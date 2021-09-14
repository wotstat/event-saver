const name = 'upd 13.09.2021'

const up = `
alter table Event_OnBattleStart
    drop column timerToStartMs;

alter table Event_OnBattleStart
    add column battleGameplay Enum8(
        'other'=0,
        'ctf'=1,
        'domination'=2,
        'assault'=3,
        'nations'=4,
        'ctf2'=5,
        'domination2'=6,
        'assault2'=7,
        'fallout'=8,
        'fallout2'=9,
        'fallout3'=10,
        'fallout4'=11,
        'ctf30x30'=12,
        'domination30x30'=13,
        'sandbox'=14,
        'bootcamp'=15,
        'epic'=16);

alter table Event_OnBattleStart
    add column loadBattlePeriod Enum8(
        'other' = 0,
        'IDLE' = 1,
        'WAITING' = 2,
        'PREBATTLE' = 3,
        'BATTLE' = 4,
        'AFTERBATTLE' = 5);

alter table Event_OnBattleStart add column serverName String;
alter table Event_OnBattleStart add column region String;

alter table Event_OnBattleStart add column battleTimeMS Int32;
alter table Event_OnBattleStart add column battleLoadTimeMS Int32;
alter table Event_OnBattleStart add column preBattleWaitTimeMS Int32;
alter table Event_OnShot add column battleTimeMS Int32;
alter table Event_OnBattleStart drop column gameRegion;
`

const down = `
alter table Event_OnBattleStart add column timerToStartMs Int32;
alter table Event_OnBattleStart add column gameRegion String;

alter table Event_OnBattleStart drop column battleGameplay;
alter table Event_OnBattleStart drop column serverName;
alter table Event_OnBattleStart drop column loadBattlePeriod;
alter table Event_OnBattleStart drop column region;
alter table Event_OnBattleStart drop column battleTimeMS;
alter table Event_OnBattleStart drop column battleLoadTimeMS;
alter table Event_OnBattleStart drop column preBattleWaitTimeMS;
alter table Event_OnShot drop column battleTimeMS;
`

export default { name, up, down }

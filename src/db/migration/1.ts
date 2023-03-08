import { MigrationData } from "../migration.js";

export default {
  name: "1",
  up: `
  create table if not exists Event_OnBattleStart (
    id              UInt128,
    dateTime        DateTime64(3) codec (DoubleDelta),
    battleTime      Int32,
    arenaId         UInt64,
    arenaTag        String,
    battleGameplay  Enum8('other'=0, 'ctf'=1, 'domination'=2, 'assault'=3, 'nations'=4, 'ctf2'=5, 'domination2'=6, 'assault2'=7, 'fallout'=8, 'fallout2'=9, 'fallout3'=10, 'fallout4'=11, 'ctf30x30'=12, 'domination30x30'=13, 'sandbox'=14, 'bootcamp'=15, 'epic'=16, 'maps_training'=17, 'rts'=18, 'rts_1x1'=19, 'rts_bootcamp'=20, 'comp7'=21),
    gameplayMask    UInt32,
    battleMode      String,
    loadBattlePeriod Enum8('other' = 0, 'IDLE' = 1, 'WAITING' = 2, 'PREBATTLE' = 3, 'BATTLE' = 4, 'AFTERBATTLE' = 5),
    gameVersion     String,
    modVersion      String, 

    playerName      String,
    playerWotId     UInt32,

    inQueueWaitTime UInt32,
    loadTime        UInt32,
    preBattleWaitTime UInt32,

    region          String,
    serverName      String,

    gunTag          String,
    tankTag         String,
    tankType        String,
    tankLevel       UInt32,
    team            UInt32,

    spawnPoint_x    Float32,
    spawnPoint_y    Float32,
    spawnPoint_z    Float32,

  ) engine MergeTree() order by id;
  `,
  down: `
    drop table if exists Event_OnBattleStart;
  `
} as MigrationData

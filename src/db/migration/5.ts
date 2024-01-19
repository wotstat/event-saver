import type { MigrationData } from "../migration";

const OldVehicleBattleResult = `
  spotted UInt16,
  mileage UInt16,
  damageAssistedTrack UInt16,
  damageReceivedFromInvisibles UInt16,
  damageReceived UInt16,
  piercingsReceived UInt16,
  directHitsReceived UInt16,
  piercingEnemyHits UInt16,
  explosionHits UInt16,
  damageAssistedRadio UInt16,
  stunDuration Float32,
  damageBlockedByArmor UInt16,
  damageDealt UInt16,
  xp UInt16,
  team UInt16,
  damaged UInt16,
  damageAssistedStun UInt16,
  explosionHitsReceived UInt16,
  directEnemyHits UInt16,
  stunned UInt16,
  shots UInt16,
  kills UInt16,
  lifeTime UInt16`

const VehicleBattleResult = `
  spotted UInt16,
  mileage UInt16,
  damageAssistedTrack UInt16,
  damageReceivedFromInvisibles UInt16,
  damageReceived UInt16,
  piercingsReceived UInt16,
  directHitsReceived UInt16,
  piercingEnemyHits UInt16,
  explosionHits UInt16,
  damageAssistedRadio UInt16,
  stunDuration Float32,
  damageBlockedByArmor UInt16,
  damageDealt UInt16,
  xp UInt16,
  team UInt16,
  damaged UInt16,
  damageAssistedStun UInt16,
  explosionHitsReceived UInt16,
  directEnemyHits UInt16,
  stunned UInt16,
  shots UInt16,
  kills UInt16,
  lifeTime UInt16,
  tankTag String,
  tankType Enum8('LT' = 0, 'MT' = 1, 'HT' = 2, 'SPG' = 3, 'AT' = 4),
  tankLevel UInt8`

export default {
  name: "5",
  up: `
  drop table if exists Event_OnBattleResult;

  create table if not exists Event_OnBattleResult (
    id UInt128,
    onBattleStartId UInt128,
    dateTime DateTime64,
    result Enum8('lose' = 0, 'win' = 1, 'tie' = 2),
    credits Int32,
    originalCredits Int32,
    duration UInt16,
    teamHealth Array(UInt16),
    winnerTeam UInt16,
    playerTeam UInt16,
    
    arenaTag        String,
    playerName      String,
    battleMode      String,
    battleGameplay  Enum8('other'=0, 'ctf'=1, 'domination'=2, 'assault'=3, 'nations'=4, 'ctf2'=5, 'domination2'=6, 'assault2'=7, 'fallout'=8, 'fallout2'=9, 'fallout3'=10, 'fallout4'=11, 'ctf30x30'=12, 'domination30x30'=13, 'sandbox'=14, 'bootcamp'=15, 'epic'=16, 'maps_training'=17, 'rts'=18, 'rts_1x1'=19, 'rts_bootcamp'=20, 'comp7'=21),
    serverName      String,
    region          String,
    gameVersion     String,
    team            UInt16,
    tankTag         String,
    tankType        String,
    tankLevel       UInt8,
    gunTag          String,
    
    playersResults Nested
    (
      ${VehicleBattleResult},
      bdid UInt64,
      name String
    ),
    ${VehicleBattleResult.split(',\n')
      .map(t => t.trim())
      .map(t => `"personal.${t.split(' ')[0]}" ${t.split(' ').splice(1).join(' ')}`).join(',\n')}
  ) engine MergeTree() order by id;
  `,
  down: `
  create table if not exists Event_OnBattleResult (
    id UInt128,
    onBattleStartId UInt128,
    dateTime DateTime64,
    result Enum8('lose' = 0, 'win' = 1, 'tie' = 2),
    credits Int32,
    originalCredits Int32,
    duration UInt16,
    teamHealth Array(UInt16),
    winnerTeam UInt16,
    playerTeam UInt16,
    playersResults Nested
    (
      ${OldVehicleBattleResult},
      bdid UInt64,
      name String
    ),
    ${OldVehicleBattleResult.split(',\n')
      .map(t => t.trim())
      .map(t => `"personal.${t.split(' ')[0]}" ${t.split(' ')[1]}`).join(',\n')}
  ) engine MergeTree() order by id;
  `
} as MigrationData
import type { MigrationData } from "../migration";

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
  lifeTime UInt16`

export default {
  name: "4",
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
      playersResults Nested
      (
        ${VehicleBattleResult},
        bdid UInt64,
        name String
      ),
      ${VehicleBattleResult.split(',\n')
      .map(t => t.trim())
      .map(t => `"personal.${t.split(' ')[0]}" ${t.split(' ')[1]}`).join(',\n')}
    ) engine MergeTree() order by id;
  `,
  down: `
  create table if not exists Event_OnBattleResult (
    id UInt128,
    onBattleStartId UInt128,
    dateTime DateTime64,
    reason String,
    durationMs UInt32,
    credits UInt32,
    xp UInt32,
    botsCount UInt32,
    result Enum8('lose' = 0, 'win' = 1)
  ) engine MergeTree() order by id;
  `
} as MigrationData
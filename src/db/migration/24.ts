import type { MigrationData } from "../migration";

export default {
  name: "24",
  up: `
  alter table Event_OnBattleResult add projection if not exists sumAvgResult (
    select
      avg(personal.piercingEnemyHits)                                 as piercingHits,
      sum(personal.directEnemyHits)                                   as sumDirect,
      sum(personal.shots)                                             as sumShots,
      sum(personal.piercingEnemyHits)                                 as sumPiercing,
      sum(personal.damageDealt)                                       as sumDealt,
      sum(personal.maxHealth - personal.health)                       as sumReach,
      sum(personal.kills)                                             as sumKills,
      sum(personal.damageBlockedByArmor)                              as sumTank,
      countIf(not personal.isAlive)                                   as sumDeath,
      sumDirect / sumShots                                            as hitPerShot,
      sumPiercing / sumDirect                                         as piercingPerHit,
      sumDealt / sumReach                                             as DR,
      sumKills / sumDeath                                             as KD,
      sumTank / sumReach                                              as TR,
      count()                                                         as count,
      avg(personal.damageDealt)                                       as damage,
      avg(personal.damageAssistedRadio)                               as damageRadio,
      avg(personal.damageAssistedTrack)                               as damageTrack,
      avg(personal.stunDuration)                                      as stunDuration,
      avg(gunMarkSum)                                                 as mgSum,
      avg(personal.spotted)                                           as spotted,
      avg(personal.damageBlockedByArmor)                              as damageBlocked,
      avg(personal.shots)                                             as shots,
      avg(personal.directEnemyHits)                                   as hits,
      avg(personal.mileage)                                           as mileage,
      avg(personal.health / personal.maxHealth)                       as health,
      avgIf(allyTeamCount - allyTeamSurvivedCount, result = 'win')    as enemyFragsWin,
      avgIf(enemyTeamCount - enemyTeamSurvivedCount, result = 'win')  as allyFragsWin,
      avgIf(allyTeamCount - allyTeamSurvivedCount, result = 'lose')   as enemyFragsLose,
      avgIf(enemyTeamCount - enemyTeamSurvivedCount, result = 'lose') as allyFragsLose
    group by battleMode, battleGameplay, tankType, tankLevel, tankRole, tankTag
  );

  alter table Event_OnBattleResult add projection if not exists visibleLevels (
    select
      visibleLevels,
      tankLevel,
      tankLevel - arrayMax(visibleLevels) as position,
      count()                             as count
    group by battleMode, battleGameplay, tankType, tankLevel, tankRole, tankTag, visibleLevels
  );

  alter table Event_OnBattleResult add projection if not exists arenaSummeryByMode (
    select
      arenaTag,
      count(*)                                    as count,
      countIf(result = 'lose')                    as loseCount,
      countIf(result = 'win')                     as winCount,

      avg(duration)                                         as avgDuration,
      avgIf(duration, result = 'lose')                      as loseDuration,
      avgIf(duration, result = 'win')                       as winDuration,

      avg(personal.damageDealt)                             as damage,
      avgIf(personal.damageDealt, result = 'lose')          as loseDamage,
      avgIf(personal.damageDealt, result = 'win')           as winDamage,

      avg(gunMarkSum)                     as mgSum,
      avgIf(gunMarkSum, result = 'lose')  as loseMgSum,
      avgIf(gunMarkSum, result = 'win')   as winMgSum,

      avg(personal.damageBlockedByArmor)                    as block,
      avgIf(personal.damageBlockedByArmor, result = 'lose') as loseBlock,
      avgIf(personal.damageBlockedByArmor, result = 'win')  as winBlock,

      avg(personal.lifeTime)                                as lifeTime,
      avgIf(personal.lifeTime, result = 'lose')             as loseLifeTime,
      avgIf(personal.lifeTime, result = 'win')              as winLifeTime,

      avg(personal.damageAssistedRadio)                     as radio,
      avgIf(personal.damageAssistedRadio, result = 'lose')  as loseRadio,
      avgIf(personal.damageAssistedRadio, result = 'win')   as winRadio,

      avg(personal.kills)                                   as kills,
      avgIf(personal.kills, result = 'lose')                as loseKills,
      avgIf(personal.kills, result = 'win')                 as winKills
    group by battleMode, battleGameplay, arenaTag
);


  alter table Event_OnBattleResult add projection if not exists arenaSummery (
    select
      arenaTag,
      count(*)                                    as count,
      countIf(result = 'lose')                    as loseCount,
      countIf(result = 'win')                     as winCount,

      avg(duration)                                         as avgDuration,
      avgIf(duration, result = 'lose')                      as loseDuration,
      avgIf(duration, result = 'win')                       as winDuration,

      avg(personal.damageDealt)                             as damage,
      avgIf(personal.damageDealt, result = 'lose')          as loseDamage,
      avgIf(personal.damageDealt, result = 'win')           as winDamage,

      avg(gunMarkSum)                     as mgSum,
      avgIf(gunMarkSum, result = 'lose')  as loseMgSum,
      avgIf(gunMarkSum, result = 'win')   as winMgSum,

      avg(personal.damageBlockedByArmor)                    as block,
      avgIf(personal.damageBlockedByArmor, result = 'lose') as loseBlock,
      avgIf(personal.damageBlockedByArmor, result = 'win')  as winBlock,

      avg(personal.lifeTime)                                as lifeTime,
      avgIf(personal.lifeTime, result = 'lose')             as loseLifeTime,
      avgIf(personal.lifeTime, result = 'win')              as winLifeTime,

      avg(personal.damageAssistedRadio)                     as radio,
      avgIf(personal.damageAssistedRadio, result = 'lose')  as loseRadio,
      avgIf(personal.damageAssistedRadio, result = 'win')   as winRadio,

      avg(personal.kills)                                   as kills,
      avgIf(personal.kills, result = 'lose')                as loseKills,
      avgIf(personal.kills, result = 'win')                 as winKills
    group by battleMode, battleGameplay, tankType, tankLevel, tankRole, tankTag, arenaTag
  );


  alter table Event_OnBattleResult materialize projection sumAvgResult;
  alter table Event_OnBattleResult materialize projection visibleLevels;
  alter table Event_OnBattleResult materialize projection arenaSummery;
  alter table Event_OnBattleResult materialize projection arenaSummeryByMode;


  `,
  down: `
  `
} as MigrationData
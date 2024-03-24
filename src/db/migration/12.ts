import type { MigrationData } from "../migration";

function addMaterializedColumn(table: string, name: string, type: string, value: string) {
  return `
  alter table ${table} add column if not exists ${name} ${type} materialized ${value};
  alter table ${table} materialize column ${name};
`
}

function addMaterializedColumnR(name: string, type: string, value: string) {
  return addMaterializedColumn('Event_OnBattleResult', name, type, value)
}

function addMaterializedColumnS(name: string, type: string, value: string) {
  return addMaterializedColumn('Event_OnShot', name, type, value)
}



const player_coverage_base = 'player_coverage_mv_tankLevel_tankType'
function player_coverage_mv(columns: string[]) {

  const sep = columns.length > 0 ? ',' : ''
  const tableName = `player_coverage_mv${columns.map(c => '_' + c).join('')}`

  return `
  create materialized view if not exists ${tableName}
  engine AggregatingMergeTree
  order by (battleMode, battleGameplay${sep} ${columns.join(', ')})
  as select battleMode, battleGameplay${sep} ${columns.join(', ')}, uniqMergeState(uniq) as uniq
  from ${player_coverage_base}
  group by battleMode, battleGameplay${sep} ${columns.join(', ')};
`
}

const allyTeamTankLevel = 'arrayFilter(t -> t.1 = playerTeam, arrayZip(playersResults.team, playersResults.tankLevel)).2'

const t = {
  name: "12",
  up: `
  ${addMaterializedColumnR('allyTeamCount', 'UInt8', 'arrayCount(t -> t = playerTeam, playersResults.team)')}
  ${addMaterializedColumnR('enemyTeamCount', 'UInt8', 'arrayCount(t -> t != playerTeam, playersResults.team)')}
  ${addMaterializedColumnR('allyTeamSurvivedCount', 'UInt8', 'arrayCount(t -> t.1 = playerTeam and t.2, arrayZip(playersResults.team, playersResults.isAlive))')}
  ${addMaterializedColumnR('enemyTeamSurvivedCount', 'UInt8', 'arrayCount(t -> t.1 != playerTeam and t.2, arrayZip(playersResults.team, playersResults.isAlive))')}

  ${addMaterializedColumnR('ltCount', 'UInt8', `arrayCount(t -> t == 'LT', playersResults.tankType)`)}
  ${addMaterializedColumnR('htCount', 'UInt8', `arrayCount(t -> t == 'HT', playersResults.tankType)`)}
  ${addMaterializedColumnR('mtCount', 'UInt8', `arrayCount(t -> t == 'MT', playersResults.tankType)`)}
  ${addMaterializedColumnR('atCount', 'UInt8', `arrayCount(t -> t == 'AT', playersResults.tankType)`)}
  ${addMaterializedColumnR('spgCount', 'UInt8', `arrayCount(t -> t == 'SPG', playersResults.tankType)`)}

  ${addMaterializedColumnR('playerTeamPositionByDamage', 'UInt8',
    `arrayCount(t -> t.1 = playerTeam and t.2 > personal.damageDealt, arrayZip(playersResults.team, playersResults.damageDealt))`)}
  ${addMaterializedColumnR('playerTeamPositionByRadio', 'UInt8',
      `arrayCount(t -> t.1 = playerTeam and t.2 > personal.damageAssistedRadio, arrayZip(playersResults.team, playersResults.damageAssistedRadio))`)}
  ${addMaterializedColumnR('playerTeamPositionByKills', 'UInt8',
        `arrayCount(t -> t.1 = playerTeam and t.2 > personal.kills, arrayZip(playersResults.team, playersResults.kills))`)}

  ${addMaterializedColumnS('serverMarkerDistance', 'UInt16',
          'L2Distance((serverMarkerPoint_x, serverMarkerPoint_y, serverMarkerPoint_z), (gunPoint_x, gunPoint_y, gunPoint_z)) CODEC(T64, ZSTD(1))')}
  ${addMaterializedColumnS('clientMarkerDistance', 'UInt16',
            'L2Distance((clientMarkerPoint_x, clientMarkerPoint_y, clientMarkerPoint_z), (gunPoint_x, gunPoint_y, gunPoint_z)) CODEC(T64, ZSTD(1))')}

  ${addMaterializedColumnS('shotFragsCount', 'UInt8', 'arrayCount(t -> t.1 > 0 and t.2 = 0, arrayZip(results.shotDamage, results.shotHealth))')}
  ${addMaterializedColumnS('firedCount', 'UInt8', 'arrayCount(t -> t > 0, results.fireDamage)')}
  ${addMaterializedColumnS('firedFragsCount', 'UInt8', 'arrayCount(t -> t.1 > 0 and t.2 = 0, arrayZip(results.fireDamage, results.fireHealth))')}
  ${addMaterializedColumnS('ammoBayDestroyedFragsCount', 'UInt8', 'countEqual(results.ammoBayDestroyed, True)')}

  ${addMaterializedColumnR('visibleLevels', 'Array(UInt8)', `arrayReverseSort(arrayDistinct(${allyTeamTankLevel}))`)}
  ${addMaterializedColumnR('visibleLevelsCount', 'Array(UInt8)', `arrayMap(t -> countEqual(${allyTeamTankLevel}, t), visibleLevels)`)}
  ${addMaterializedColumnR('gunMarkSum', 'UInt16', `personal.damageDealt + max2(personal.damageAssistedRadio, max2(personal.damageAssistedTrack, personal.damageAssistedStun))`)}


  create materialized view if not exists ${player_coverage_base}
  engine AggregatingMergeTree
  order by (battleMode, battleGameplay, tankLevel, tankType)
  as select battleMode, battleGameplay, tankLevel, tankType, uniqState(arrayJoin(playersResults.name)) as uniq
  from Event_OnBattleResult
  group by battleMode, battleGameplay, tankLevel, tankType;

  ${player_coverage_mv(['tankType'])}
  ${player_coverage_mv(['tankLevel'])}
  ${player_coverage_mv([])}


  insert into ${player_coverage_base}
    select battleMode, battleGameplay, tankLevel, tankType, uniqState(arrayJoin(playersResults.name))
    from Event_OnBattleResult
    group by battleMode, battleGameplay, tankLevel, tankType;



  alter table Event_OnShot
    add projection projection_stats (
        select count()                                                                               as count,
               countIf(length(results.shotDamage) > 0)                                               as hits,
               countIf(arrayMax(results.shotDamage) > 0)                                             as damaged,
               countIf(ballisticResultClient_r <= 0.5)                                               as first50,
               countIf(ballisticResultClient_r <= 0.3333)                                            as first30,
               countIf(abs(serverShotDispersion / gunDispersion) between 0.999 and 1.001 or
                       abs(clientShotDispersion / gunDispersion) between 0.999 and 1.001)            as full,
               countIf(abs(turretSpeed) + abs(vehicleRotationSpeed) < 1 and abs(vehicleSpeed) < 0.5) as stopped,
               countIf(clientMarkerDistance > 300)                                                   as dist300
        group by battleMode, battleGameplay, tankLevel, tankType, tankTag);
  alter table Event_OnShot materialize projection projection_stats; 




    

  alter table Event_OnShot
    add projection accuracy_client_stats (
        select count()                           as count,
               round(if(ballisticResultClient_r < 2, ballisticResultClient_r, 3), 2) as clientR
        group by battleMode, battleGameplay, tankLevel, tankType, tankTag, clientR);
  alter table Event_OnShot materialize projection accuracy_client_stats;

  alter table Event_OnShot
    add projection accuracy_server_stats (
        select count()                           as count,
               round(if(ballisticResultServer_r < 2, ballisticResultServer_r, 3), 2) as serverR
        group by battleMode, battleGameplay, tankLevel, tankType, tankTag, serverR);
  alter table Event_OnShot materialize projection accuracy_server_stats;





  create table accuracy_hit_points (
    id UInt128,
    onBattleStartId UInt128,
    battleMode LowCardinality(String),
    battleGameplay LowCardinality(String),
    tankLevel UInt8,
    tankType LowCardinality(String),
    tankTag LowCardinality(String),
    r Float32,
    theta Float32,
    hit Boolean,

    index tankTag_index tankTag type set(1000),
    index tankLevel_index tankLevel type set(10),
    index tankType_index tankType type set(10),
    index battleMode_index battleMode type set(50),
    index battleGameplay_index battleGameplay type set(50)
  ) engine MergeTree order by id;

  create materialized view if not exists accuracy_hit_points_mv to accuracy_hit_points
  as select
    id, onBattleStartId,
    battleMode, battleGameplay, tankLevel, tankType, tankTag,
    ballisticResultClient_r     as r,
    ballisticResultClient_theta as theta,
    length(results.order) > 0   as hit
  FROM Event_OnShot;



  alter table Event_OnShot
    add projection projection_damage (
        with arrayMax(results.shotDamage) as dmg,
             indexOf(results.shotDamage, dmg) as idx,
             results.shotHealth[idx] as health,
             results.ammoBayDestroyed[idx] as ab,
             health + dmg as healthBeforeShot,
             dmg > 0 and health > 0 and idx > 0 and (dmg + health) > round(shellDamage * 1.250001) as representative,
             ((toFloat32(dmg) / shellDamage) - 1) / damageRandomization AS dmgRelativeShell,
             length(results.shotDamage) as hits
        select
            count() as count,
            avgIf(dmgRelativeShell, representative) AS avgDamage,
            countIf(representative and dmg < shellDamage) AS less,
            countIf(representative and dmg > shellDamage) AS more,
            countIf(representative and dmg = shellDamage) AS equal,
            countIf(hits > 0) as hitCount,
            countIf(hits > 0 and dmg > 0) as hitDamaged,
            countIf(hits > 0 and dmg = 0) as hitNoDamaged,
            sum(firedCount) as firesSum,
            sum(shotFragsCount) as shotFragsSum,
            sum(firedFragsCount) as firedFragsSum,
            sum(ammoBayDestroyedFragsCount) as ammoBayDestroyedFragsSum,
            countIf(dmg > 0 and health = 0 and healthBeforeShot > shellDamage and not ab) as stilled,
            countIf(dmg > 0 and health != 0 and healthBeforeShot < shellDamage) as saved
        group by battleMode, battleGameplay, tankLevel, tankType, tankTag, shellTag);

  alter table Event_OnShot materialize projection projection_damage;



  create materialized view team_results_mv
  engine AggregatingMergeTree
  order by (result, playersCount, battleMode, battleGameplay, tankLevel, tankType, tankTag)
  populate as
  with
      arrayZip(playersResults.team, playersResults.damageDealt, playersResults.damageBlockedByArmor, playersResults.damageAssistedRadio, playersResults.kills) as teamValues,
      arrayFilter(t -> t.1 = playerTeam, teamValues) as allyTeam,
      arrayFilter(t -> t.1 != playerTeam, teamValues) as enemyTeam,
      length(playersResults.team) as playersCount
  select battleMode, battleGameplay, tankLevel, tankType, tankTag, result, playersCount,
        avgForEachState(arrayReverseSort(allyTeam.2))  as allyDamages,
        avgForEachState(arrayReverseSort(allyTeam.3))  as allyBlocks,
        avgForEachState(arrayReverseSort(allyTeam.4))  as allyRadios,
        avgForEachState(arrayReverseSort(allyTeam.5))  as allyKills,
        avgForEachState(arrayReverseSort(enemyTeam.2)) as enemyDamages,
        avgForEachState(arrayReverseSort(enemyTeam.3)) as enemyBlocks,
        avgForEachState(arrayReverseSort(enemyTeam.4)) as enemyRadios,
        avgForEachState(arrayReverseSort(enemyTeam.5)) as enemyKills
  from Event_OnBattleResult
  group by battleMode, battleGameplay, tankLevel, tankType, tankTag, result, playersCount;



  alter table Event_OnShot
    add projection projection_damage_simple_distribution (
        with arrayMax(results.shotDamage) as dmg,
             indexOf(results.shotDamage, dmg) as idx,
             results.shotHealth[idx] as health,
             dmg > 0 and health > 0 and idx > 0 and (dmg + health) > round(shellDamage * 1.250001) as representative,
             ((toFloat32(dmg) / shellDamage) - 1) / damageRandomization AS dmgRelativeShell,
             length(results.shotDamage) as hits,
             max2(-1, min2(1, round(dmgRelativeShell, 1))) as rounded,
             if(rounded = -0, 0, rounded) as trueRounded
        select
            trueRounded * 10 as k,
            countIf(representative and hits > 0) as count
        group by k, battleMode, battleGameplay, tankLevel, tankType, tankTag, shellTag);
  alter table Event_OnShot materialize projection projection_damage_simple_distribution;
  `,
  down: `
  `
} as MigrationData


/*
optimize


optimize table accuracy_hit_points final;
optimize table team_results_mv final;

optimize table player_coverage_mv_tankType final;
optimize table player_coverage_mv_tankLevel final;
optimize table player_coverage_mv final;
optimize table player_coverage_mv_tankLevel_tankType final;


insert into accuracy_hit_points select
  id, onBattleStartId,
  battleMode, battleGameplay, tankLevel, tankType, tankTag,
  ballisticResultClient_r     as r,
  ballisticResultClient_theta as theta,
  length(results.order) > 0   as hit
from Event_OnShot;

*/

export default t
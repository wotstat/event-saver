const name = 'init'

const up = `
create table if not exists Event_OnBattleStart
(
    id              UUID,
    dateTime        DateTime64(3) codec (DoubleDelta),
    arenaWGID       UInt64,
    arenaTag        String,
    battleMode      String,
    playerWGID      UInt32,
    playerName      String,
    playerClanTag   String,
    tankTag         String,
    tankType        String,
    tankLevel       UInt8,
    gunTag          String,
    startDispersion Float64,
    timerToStartMs  Int32,
    spawnPoint_x    Float32,
    spawnPoint_y    Float32,
    spawnPoint_z    Float32,
    team            UInt8,
    modVersion      String,
    gameVersion     String,
    gameRegion      String
) engine = MergeTree()
      order by (dateTime, arenaWGID);

create table if not exists Event_OnShot
(
    id                   UUID,
    onBattleStart_id     UUID,
    dateTime             DateTime64(3) codec (DoubleDelta),

    shotWGID             UInt32,
    shellTag             String,
    gunDispersion        Float64,
    battleDispersion     Float64,
    serverShotDispersion Float64,
    clientShotDispersion Float64,
    gravity              Float32,

    gunPoint_x           Float32,
    gunPoint_y           Float32,
    gunPoint_z           Float32,

    clientMarkerPoint_x  Float32,
    clientMarkerPoint_y  Float32,
    clientMarkerPoint_z  Float32,

    serverMarkerPoint_x  Float32,
    serverMarkerPoint_y  Float32,
    serverMarkerPoint_z  Float32,

    tracerStart_x        Float32,
    tracerStart_y        Float32,
    tracerStart_z        Float32,

    tracerEnd_x          Float32,
    tracerEnd_y          Float32,
    tracerEnd_z          Float32,

    tracerVelocity_x     Float32,
    tracerVelocity_y     Float32,
    tracerVelocity_z     Float32,

    hitPoint_x           Nullable(Float32) default Null,
    hitPoint_y           Nullable(Float32) default Null,
    hitPoint_z           Nullable(Float32) default Null,

    hitReason            Nullable(Enum8('tank' = 1, 'terrain' = 2, 'other' = 3)),
    serverAim            UInt8,
    autoAim              UInt8,
    ping                 Float32
) engine = MergeTree()
      order by (dateTime);

create table if not exists Event_OnBattleResult
(
    id               UUID,
    onBattleStart_id UUID,
    dateTime         DateTime64(3) codec (DoubleDelta),
    reason           Enum8('normal' =1, 'timeout' = 2),
    durationMs       Nullable(UInt32)                                    default NULL,
    credits          Nullable(Int16)                                     default NULL,
    xp               Nullable(UInt16)                                    default NULL,
    botsCount        Nullable(UInt8)                                     default NULL,
    result           Nullable(Enum8('win' = 1, 'lose' = 2, 'error' = 3)) default NULL
) engine = MergeTree()
      order by (dateTime);
`

const down = `
drop table if exists Event_OnBattleStart;
drop table if exists Event_OnShot;
drop table if exists Event_OnBattleStart;
`

export default { name, up, down }

import { Insert } from "../dbProvider.js"
import { Vector3Unwrap } from "../utils.js"

export default function Process(uuid, e) {
    Insert('Event_OnBattleStart',
    {
        id                  : uuid,                         // UUID,
        dateTime            : e.Date,                       // DateTime64(3) codec (DoubleDelta),
        arenaWGID           : e.ArenaID,                    // UInt64,
        arenaTag            : e.ArenaTag,                   // String,
        battleMode          : e.BattleMode,                 // String,
        playerWGID          : e.PlayerBDID,                 // UInt32,
        playerName          : e.PlayerName,                 // String,
        playerClanTag       : e.PlayerClan,                 // String,
        tankTag             : e.TankTag,                    // String,
        tankType            : e.TankType,                   // String,
        tankLevel           : e.TankLevel,                  // UInt8,
        gunTag              : e.GunTag,                     // String,
        startDispersion     : e.StartDis,                   // Float64,
        timerToStartMs      : null,                         // Int32,
        team                : e.Team,                       // UInt8,
        modVersion          : e.ModVersion,                 // String,
        gameVersion         : e.GameVersion,                // String,  //TODO: разделить на 4 столбца
        gameRegion          : e.GameVersion.split('_')[0],  // String
        ...Vector3Unwrap('spawnPoint', e.SpawnPoint)
    })
}
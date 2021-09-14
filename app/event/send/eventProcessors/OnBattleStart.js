import { Insert } from "../insert.js"

import { Vector3Unwrap, S2MS } from "../utils.js"

export default function Process(uuid, e) {
    Insert('Event_OnBattleStart',
    {
        id                  : uuid,                             // UUID,
        dateTime            : e.Date,                           // DateTime64(3) codec (DoubleDelta),
        arenaWGID           : e.ArenaID,                        // UInt64,
        arenaTag            : e.ArenaTag,                       // String,
        battleMode          : e.BattleMode,                     // String,
        battleGameplay      : parseGameplay(e.BattleGameplay),  // Enum8('other'=0, 'ctf'=1, 'domination'=2, 'assault'=3, 'nations'=4, 'ctf2'=5, 'domination2'=6, 'assault2'=7, 'fallout'=8, 'fallout2'=9, 'fallout3'=10, 'fallout4'=11, 'ctf30x30'=12, 'domination30x30'=13, 'sandbox'=14, 'bootcamp'=15, 'epic'=16)
        playerWGID          : e.PlayerBDID,                     // UInt32,
        playerName          : e.PlayerName,                     // String,
        playerClanTag       : e.PlayerClan,                     // String,
        tankTag             : e.TankTag,                        // String,
        tankType            : e.TankType,                       // String,
        tankLevel           : e.TankLevel,                      // UInt8,
        gunTag              : e.GunTag,                         // String,
        startDispersion     : e.StartDis,                       // Float64,
        team                : e.Team,                           // UInt8,
        modVersion          : e.ModVersion,                     // String,
        gameVersion         : e.GameVersion,                    // String,  //TODO: разделить на 4 столбца
        region              : e.Region,                         // String
        serverName          : e.ServerName,                     // String
        loadBattlePeriod    : parsePeriod(e.BattlePeriod),      // Enum8('other'=0, 'IDLE'=1, 'WAITING'=2, 'PREBATTLE'=3, 'BATTLE'=4, 'AFTERBATTLE'=5)
        battleTimeMS        : S2MS(e.BattleTime),               // Int32
        battleLoadTimeMS    : S2MS(e.LoadTime),                 // Int32
        preBattleWaitTimeMS : S2MS(e.PreBattleWaitTime),        // Int32
        ...Vector3Unwrap('spawnPoint', e.SpawnPoint)
    })
}


function parseGameplay(gameplay) {
    const gameplays = ['ctf',
        'domination',
        'assault',
        'nations',
        'ctf2',
        'domination2',
        'assault2',
        'fallout',
        'fallout2',
        'fallout3',
        'fallout4',
        'ctf30x30',
        'domination30x30',
        'sandbox',
        'bootcamp',
        'epic']
    if (gameplays.includes(gameplay)) {
        return gameplay
    } else {
        return 'other'
    }
}   

function parsePeriod(period) {
    const periods = ['IDLE', 'WAITING', 'PREBATTLE', 'BATTLE', 'AFTERBATTLE']

    if (periods.includes(period)) {
        return period
    } else {
        return 'other'
    }
}

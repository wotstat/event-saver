
import { v4 as uuidv4 } from 'uuid';
import { Insert } from "../dbProvider.js"


export default function Process(battleUUID, e) {
    Insert('Event_OnBattleResult',
        {

            id               : uuidv4(),         // UUID,
            onBattleStart_id : battleUUID,       // UUID,
            dateTime         : e.Date,           // DateTime64(3) codec (DoubleDelta),
            reason           : 'normal',         // Enum8('normal' =1, 'timeout' = 2),
            durationMs       : e.Duration,       // Nullable(UInt32)                                    default NULL,
            credits          : e.Credits,        // Nullable(Int16)                                     default NULL,
            xp               : e.XP,             // Nullable(UInt16)                                    default NULL,
            botsCount        : e.BotsCount,      // Nullable(UInt8)                                     default NULL,
            result           : e.Result,         // Nullable(Enum8('win' = 1, 'lose' = 2, 'error' = 3)) default NULL

        }
    )
}
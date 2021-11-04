import { Insert } from "../insert.js"
import { Vector3Unwrap, CHBool, S2MS } from '../utils.js'
import { v4 as uuidv4 } from 'uuid'

export default function Process(battleUUID, e) {
    Insert('Event_OnShot',
        {
            id:                             uuidv4(),                 // UUID,
            onBattleStart_id:               battleUUID,               // UUID,
            dateTime:                       e.Date,                   // DateTime64(3) codec (DoubleDelta),
            shotWGID:                       e.ShotID,                 // UInt32,
            shellTag:                       e.ShellTag,               // String,
            gunDispersion:                  e.GunDispersion,          // Float64,
            battleDispersion:               e.BattleDispersion,       // Float64,
            serverShotDispersion:           e.ServerShotDispersion,   // Float64,
            clientShotDispersion:           e.ClientShotDispersion,   // Float64,
            gravity:                        e.Gravity,                // Float32,
            hitReason:                      e.HitReason,              // Nullable(Enum8('tank' = 1, 'terrain' = 2, 'other' = 3)),
            serverAim:                      CHBool(e.ServerAim),      // UInt8,
            autoAim:                        CHBool(e.AutoAim),        // UInt8,
            ping:                           e.Ping,                   // Float32
            battleTimeMS:                   S2MS(e.BattleTime),       // Int32
            fps:                            e.FPS,                    // Float32
            'results.order':                e.Results.map(t => t.order),
            'results.tankTag':              e.Results.map(t => t.tankTag),
            'results.shotDamage':           e.Results.map(t => t.shotDamage),
            'results.fireDamage':           e.Results.map(t => t.fireDamage),
            'results.shotHealth':           e.Results.map(t => t.shotHealth),
            'results.fireHealth':           e.Results.map(t => t.fireHealth),
            'results.flags':                e.Results.map(t => t.flags),
            'results.ammoBayDestroyed':     e.Results.map(t => CHBool(t.ammoBayDestroyed)),
            ...Vector3Unwrap('gunPoint', e.GunPoint),
            ...Vector3Unwrap('clientMarkerPoint', e.ClientMarkerPoint),
            ...Vector3Unwrap('serverMarkerPoint', e.ServerMarkerPoint),
            ...Vector3Unwrap('tracerStart', e.TracerStart),
            ...Vector3Unwrap('tracerEnd', e.TracerEnd),
            ...Vector3Unwrap('tracerVelocity', e.TracerVel),
            ...(e.HitPoint ? Vector3Unwrap('hitPoint', e.HitPoint) : null),
        }
    )
    console.log(`Event_OnShot ${battleUUID}`)
}

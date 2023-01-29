import { Insert } from "../insert.js"
import { Vector3Unwrap, CHBool, S2MS, TupleStringToArray, ArrayAverage } from '../utils.js'
import { v4 as uuidv4 } from 'uuid'

export default function Process(battleUUID, e) {
    const shellDamage = TupleStringToArray(e.ShellDamage);
    const shellPiercingPower = TupleStringToArray(e.ShellPiercingPower);
    
    Insert('Event_OnShot',
        {
            id:                             uuidv4(),                 // UUID,
            onBattleStart_id:               battleUUID,               // UUID,
            dateTime:                       e.Date,                   // DateTime64(3) codec (DoubleDelta),
            shotWGID:                       e.ShotID,                 // UInt32,
            shellTag:                       e.ShellTag,               // String,
            shellName:                      e.ShellName,              // String,
            shellDamage:                    ArrayAverage(shellDamage),// Float64,
            shellDamageMin:                 Math.min(...shellDamage), // Float64,
            shellDamageMax:                 Math.max(...shellDamage), // Float64,
            shellPiercingPower:             ArrayAverage(shellPiercingPower), // Float64,
            shellPiercingPowerMin:          Math.min(...shellPiercingPower),  // Float64,
            shellPiercingPowerMax:          Math.max(...shellPiercingPower),  // Float64,
            shellCaliber:                   e.ShellCaliber,           // UInt32,
            shellSpeed:                     e.ShellSpeed,             // Float64,
            shellMaxDistance:               e.ShellMaxDistance,       // UInt32,
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
            hitVehicleDescr:                e.HitVehicleDescr,        // UInt16
            hitChassisDescr:                e.HitChassisDescr,        // UInt16
            hitTurretDescr:                 e.HitTurretDescr,         // UInt16
            hitGunDescr:                    e.HitGunDescr,            // UInt16
            hitSegment:                     e.HitSegment ? BigInt(e.HitSegment).toString() : null, // UInt64
            hitTurretYaw:                   e.HitTurretYaw,           // Float32
            hitTurretPitch:                 e.HitTurretPitch,         // Float32
            vehicleDescr:                   e.VehicleDescr,           // UInt16
            chassisDescr:                   e.ChassisDescr,           // UInt16
            turretDescr:                    e.TurretDescr,            // UInt16
            gunDescr:                       e.GunDescr,               // UInt16
            shellDescr:                     e.ShellDescr,             // UInt16
            turretYaw:                      e.TurretYaw,              // Float32
            turretPitch:                    e.TurretPitch,            // Float32
            vehicleSpeed:                   e.VehicleSpeed,           // Float32
            turretSpeed:                    e.TurretSpeed,            // Float32
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
import { insert } from "../insert.js"
import { now, unwrapDynamicBattleInfo, unwrapVector3 } from './utils.js';

import { check, onShotSchema } from '@/types/validator.js';
import { uuid } from "@/utils/utils.js";


export default function process(battleUUID: string, e: any) {
  check(onShotSchema, e, (e) => {
    insert('Event_OnBattleResult', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      shellTag: e.shellTag,
      shellName: e.shellName,
      shellDamage: e.shellDamage,
      shellPiercingPower: e.shellPiercingPower,
      shellCaliber: e.shellCaliber,
      shellSpeed: e.shellSpeed,
      shellMaxDistance: e.shellMaxDistance,
      gunDispersion: e.gunDispersion,
      battleDispersion: e.battleDispersion,
      serverShotDispersion: e.serverShotDispersion,
      clientShotDispersion: e.clientShotDispersion,
      gravity: e.gravity,
      serverAim: e.serverAim,
      autoAim: e.autoAim,
      ping: e.ping,
      fps: e.fps,
      hitVehicleDescr: e.hitVehicleDescr,
      hitChassisDescr: e.hitChassisDescr,
      hitTurretDescr: e.hitTurretDescr,
      hitGunDescr: e.hitGunDescr,
      hitTurretYaw: e.hitTurretYaw,
      hitTurretPitch: e.hitTurretPitch,
      vehicleDescr: e.vehicleDescr,
      chassisDescr: e.chassisDescr,
      turretDescr: e.turretDescr,
      gunDescr: e.gunDescr,
      turretYaw: e.turretYaw,
      turretPitch: e.turretPitch,
      shellDescr: e.shellDescr,
      hitSegment: e.hitSegment,
      vehicleSpeed: e.vehicleSpeed,
      turretSpeed: e.turretSpeed,
      ...unwrapVector3('gunPoint', e.gunPoint),
      ...unwrapVector3('clientMarkerPoint', e.clientMarkerPoint),
      ...unwrapVector3('serverMarkerPoint', e.serverMarkerPoint),
      ...unwrapVector3('tracerStart', e.tracerStart),
      ...unwrapVector3('tracerEnd', e.tracerEnd),
      ...unwrapVector3('tracerVel', e.tracerVel),
      hitReason: e.hitReason,
      hitPoint: e.hitPoint,
      'results.order': e.results.map(r => r.order),
      'results.tankTag': e.results.map(r => r.tankTag),
      'results.shotDamage': e.results.map(r => r.shotDamage),
      'results.fireDamage': e.results.map(r => r.fireDamage),
      'results.shotHealth': e.results.map(r => r.shotHealth),
      'results.fireHealth': e.results.map(r => r.fireHealth),
      'results.ammoBayDestroyed': e.results.map(r => r.ammoBayDestroyed),
      'results.flags': e.results.map(r => r.flags),
      ...unwrapDynamicBattleInfo(e)
    })
  })
}

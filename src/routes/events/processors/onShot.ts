import { insert } from "../insert"
import { now, unwrapDynamicBattleInfo, unwrapVector3 } from './utils';
import { BallisticCalculator } from "@/utils/ballisticCalc";

import { check, onShotSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";

export default function process(battleUUID: string, e: any) {
  check(onShotSchema, e, (e) => {

    const shared = {
      gravity: -e.gravity,
      gunPos: e.gunPoint,
      tracerStart: e.tracerStart,
      tracerVelocity: e.tracerVel,
    }

    const clientBallistic = BallisticCalculator.calculate({
      ...shared,
      markerPos: e.clientMarkerPoint,
      dispersionAngle: e.clientShotDispersion,
    })

    const serverBallistic = BallisticCalculator.calculate({
      ...shared,
      markerPos: e.serverMarkerPoint,
      dispersionAngle: e.serverShotDispersion,
    })

    insert('Event_OnShot', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      localtime: e.localtime,

      ballisticResultClient_r: clientBallistic.r,
      ballisticResultClient_theta: clientBallistic.theta,
      ballisticResultServer_r: serverBallistic.r,
      ballisticResultServer_theta: serverBallistic.theta,

      shotId: e.shotId,
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
      vehicleRotationSpeed: e.vehicleRotationSpeed,
      turretSpeed: e.turretSpeed,
      ...unwrapVector3('gunPoint', e.gunPoint),
      ...unwrapVector3('clientMarkerPoint', e.clientMarkerPoint),
      ...unwrapVector3('serverMarkerPoint', e.serverMarkerPoint),
      ...unwrapVector3('tracerStart', e.tracerStart),
      ...unwrapVector3('tracerEnd', e.tracerEnd),
      ...unwrapVector3('tracerVel', e.tracerVel),
      hitReason: e.hitReason === null ? 'none' : e.hitReason,
      ...unwrapVector3('hitPoint', e.hitPoint),
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

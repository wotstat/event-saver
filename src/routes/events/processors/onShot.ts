import { insert } from "../insert"
import { now, unwrapBattleEvent, unwrapDynamicBattleInfo, unwrapSessionMeta, unwrapVector3 } from './utils';
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

    let clientBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null
    let serverBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null

    try {
      clientBallistic = BallisticCalculator.calculate({
        ...shared,
        markerPos: e.clientMarkerPoint,
        dispersionAngle: e.clientShotDispersion,
      })
    } catch (error) {
      console.error(`Error calculating client ballistic: ${error}. Event: ${JSON.stringify(e)}`)
    }

    try {
      serverBallistic = BallisticCalculator.calculate({
        ...shared,
        markerPos: e.serverMarkerPoint,
        dispersionAngle: e.serverShotDispersion,
      })
    } catch (error) {
      console.error(`Error calculating server ballistic: ${error}. Event: ${JSON.stringify(e)}`)
    }

    if (clientBallistic === null || serverBallistic === null) return

    insert('Event_OnShot', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      localtime: e.localtime,
      health: e.health,

      ballisticResultClient_r: clientBallistic.r,
      ballisticResultClient_theta: clientBallistic.theta,
      ballisticResultServer_r: serverBallistic.r,
      ballisticResultServer_theta: serverBallistic.theta,

      shotId: e.shotId,
      shellTag: e.shellTag,
      shellName: e.shellName,
      shellDamage: e.shellDamage,
      damageRandomization: e.damageRandomization,
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
      ping: Math.max(Math.min(Math.round(e.ping * 1000), 65535), 0),
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
      hitSegment: e.hitSegment ?? '0',
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
      ...unwrapDynamicBattleInfo(e),
      ...unwrapBattleEvent(e),
      ...unwrapSessionMeta(e)
    }, e)
  })
}

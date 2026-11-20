import type { BattleEvent } from '../utils/event'
import type { UInt16, UInt32, Vector3 } from '../utils/primitives'

export interface OnShot extends BattleEvent {
  /** id выстрела уникальный для клиента */
  shotId: number,

  /** ХП игрока в момент выстрела */
  health: UInt16,

  /** Тип снаряда */
  shellTag: string
  /**   */
  shellName: string,

  /** Средний урон снаряда */
  shellDamage: number,
  /** Разброс урона снаряда +-25 */
  damageRandomization: number,
  /** Среднее пробитие снаряда */
  shellPiercingPower: number,
  /** Калибр снаряда */
  shellCaliber: number,
  /** Скорость снаряла по ттх */
  shellSpeed: number,
  /** Максимальная дистанци полёта снаряда */
  shellMaxDistance: UInt16,

  /** Разброс орудия с учётом временных бафов (например оглушение) */
  gunDispersion: number,
  /** Разброс орудия по ттх без временных бафов, но с учётом оборудования */
  battleDispersion: number,
  /** Серверное сведение */
  serverShotDispersion: number,
  /** Клиентское сведение */
  clientShotDispersion: number,

  /** Ускорение */
  acceleration: Vector3,

  /** Используется ли серверный прицел */
  serverAim: boolean,
  /** Используется автоприцел */
  autoAim: boolean,
  /** Пинг */
  ping: number,
  /** Частота кадров */
  fps: UInt16,

  // Параметры попадания
  /** ID корпуса танка по которому попал снаряд */
  hitVehicleDescr: UInt32 | null,
  /** ID ходовой танка по которому попал снаряд */
  hitChassisDescr: UInt32 | null,
  /** ID башни танка по которому попал снаряд */
  hitTurretDescr: UInt32 | null,
  /** ID пушки танка по которому попал снаряд */
  hitGunDescr: UInt32 | null,
  /** Yaw башни танка по которому попал снаряд */
  hitTurretYaw: number | null,
  /** Pitch башни танка по которому попал снаряд */
  hitTurretPitch: number | null,
  /** ID корпуса своего танка */
  vehicleDescr: UInt32,
  /** ID ходовой своего танка */
  chassisDescr: UInt32,
  /** ID башни своего танка */
  turretDescr: UInt32,
  /** ID пушки своего танка */
  gunDescr: UInt32,
  /** Yaw башни совего танка  */
  turretYaw: number,
  /** Pitch башни совего танка */
  turretPitch: number,
  /** ID снаряда */
  shellDescr: UInt32,
  /** Первый элемент массива `points` [Vehicle.showDamageFromShot](https://github.com/StranikS-Scan/WorldOfTanks-Decompiled/blob/ed9c58eecc460df6f293c60202f0f1ba26e65ab0/source/res/scripts/client/Vehicle.py#L349) */
  hitSegment: string | null,

  /** Скорость танка в момент выстрела */
  vehicleSpeed: number,
  /** Скорость вращения танков в момент выстрела */
  vehicleRotationSpeed: number,
  /** Скорость вращения башни в момент выстрела */
  turretSpeed: number,
  /** Координата пушки */
  gunPoint: Vector3,
  /** Координата клиентского маркера */
  clientMarkerPoint: Vector3,
  /** Координата серверного маркера */
  serverMarkerPoint: Vector3,
  /** Координата старта трассера */
  tracerStart: Vector3,
  /** Координата конца трассера */
  tracerEnd: Vector3,
  /** Вектор начальной скорости трассера */
  tracerVel: Vector3,

  /** Причина попадания (tank, terrain, other, none) */
  hitReason: 'tank' | 'terrain' | 'other' | 'none' | null,
  /** Координата попадания */
  hitPoint: Vector3 | null,

  /** Результаты попадания */
  results: {
    /** Очерёдность попадания */
    order: UInt16,
    /** Тег танка по которому попал */
    tankTag: string,
    /** Урон выстрелом */
    shotDamage: UInt16,
    /** Урон огнём */
    fireDamage: UInt16,
    /** ХП противника оставшееся после выстрела */
    shotHealth: UInt16 | null,
    /** ХП противника оставшееся после пожара */
    fireHealth: UInt16 | null,
    /** Был ли взрыв БК */
    ammoBayDestroyed: boolean,
    /** Флаги попадания [VEHICLE_HIT_FLAGS](https://github.com/StranikS-Scan/WorldOfTanks-Decompiled/blob/a301bd7678d1c9c1d618fdaa87fba91447989e91/source/res/scripts/common/constants.py#L1145)                        */
    flags: UInt32,
  }[],
}

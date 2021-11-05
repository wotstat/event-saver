const name = 'upd 05.11.2021 (add shot desct)'

const up = `
alter table Event_OnShot add column hitVehicleDescr UInt16;
alter table Event_OnShot add column hitChassisDescr UInt16;
alter table Event_OnShot add column hitTurretDescr UInt16;
alter table Event_OnShot add column hitGunDescr UInt16;
alter table Event_OnShot add column hitSegment UInt64;
alter table Event_OnShot add column hitTurretYaw Float32;
alter table Event_OnShot add column hitTurretPitch Float32;

alter table Event_OnShot add column vehicleDescr UInt16;
alter table Event_OnShot add column chassisDescr UInt16;
alter table Event_OnShot add column turretDescr UInt16;
alter table Event_OnShot add column gunDescr UInt16;
alter table Event_OnShot add column shellDescr UInt16;

alter table Event_OnShot add column turretYaw Float32;
alter table Event_OnShot add column turretPitch Float32;

alter table Event_OnShot add column vehicleSpeed Float32;
alter table Event_OnShot add column turretSpeed Float32;
`

const down = `  
alter table Event_OnShot drop column hitVehicleDescr;
alter table Event_OnShot drop column hitChassisDescr;
alter table Event_OnShot drop column hitTurretDescr;
alter table Event_OnShot drop column hitGunDescr;
alter table Event_OnShot drop column vehicleDescr;
alter table Event_OnShot drop column chassisDescr;
alter table Event_OnShot drop column turretDescr;
alter table Event_OnShot drop column gunDescr;
alter table Event_OnShot drop column shellDescr;
alter table Event_OnShot drop column hitSegment;
alter table Event_OnShot drop column hitTurretYaw;
alter table Event_OnShot drop column hitTurretPitch;
alter table Event_OnShot drop column turretYaw;
alter table Event_OnShot drop column turretPitch;
alter table Event_OnShot drop column vehicleSpeed;
alter table Event_OnShot drop column turretSpeed;
`

export default { name, up, down }

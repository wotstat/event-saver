const name = 'upd 06.11.2021 (add inQueueWaitTimeMS)'

const up = `
alter table Event_OnShot add column shellName String;
alter table Event_OnShot add column shellDamageMin Float32;
alter table Event_OnShot add column shellDamageMax Float32;
alter table Event_OnShot add column shellPiercingPowerMin Float32;
alter table Event_OnShot add column shellPiercingPowerMax Float32;
alter table Event_OnShot add column shellCaliber UInt32;
alter table Event_OnShot add column shellSpeed Float32;
alter table Event_OnShot add column shellMaxDistance UInt32;
`

const down = `  
alter table Event_OnShot drop column shellName;
alter table Event_OnShot drop column shellDamageMin;
alter table Event_OnShot drop column shellDamageMax;
alter table Event_OnShot drop column shellPiercingPowerMin;
alter table Event_OnShot drop column shellPiercingPowerMax;
alter table Event_OnShot drop column shellCaliber;
alter table Event_OnShot drop column shellSpeed;
alter table Event_OnShot drop column shellMaxDistance;
`

export default { name, up, down }

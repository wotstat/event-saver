const name = 'upd 29.01.2023 (add shell info)'

const up = `
alter table Event_OnShot add column shellName String;
alter table Event_OnShot add column shellDamage Float32;
alter table Event_OnShot add column shellPiercingPower Float32;
alter table Event_OnShot add column shellCaliber UInt32;
alter table Event_OnShot add column shellSpeed Float32;
alter table Event_OnShot add column shellMaxDistance UInt32;
`

const down = `  
alter table Event_OnShot drop column shellName;
alter table Event_OnShot drop column shellDamage;
alter table Event_OnShot drop column shellPiercingPower;
alter table Event_OnShot drop column shellCaliber;
alter table Event_OnShot drop column shellSpeed;
alter table Event_OnShot drop column shellMaxDistance;
`

export default { name, up, down }

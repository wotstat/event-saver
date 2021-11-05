const name = 'upd 28.10.2021 (add shot results)'

const up = `
alter table Event_OnShot
    add column results Nested
    (
        order UInt8,
        tankTag String,
        shotDamage Nullable(UInt16),
        fireDamage Nullable(UInt16),
        shotHealth Nullable(UInt16),
        fireHealth Nullable(UInt16),
        flags UInt16,
        ammoBayDestroyed UInt8
    );

alter table Event_OnShot add column fps Float32;
    
`

const down = `
alter table Event_OnShot drop column results.order;
alter table Event_OnShot drop column results.tankTag;
alter table Event_OnShot drop column results.shotDamage;
alter table Event_OnShot drop column results.fireDamage;
alter table Event_OnShot drop column results.shotHealth;
alter table Event_OnShot drop column results.fireHealth;
alter table Event_OnShot drop column results.flags;
alter table Event_OnShot drop column results.ammoBayDestroyed;
alter table Event_OnShot drop column fps;
`

export default { name, up, down }

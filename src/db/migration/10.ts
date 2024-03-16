import type { MigrationData } from "../migration";

export default {
  name: "10",
  up: `
  alter table Event_OnShot add column hitSegment2 UInt128 CODEC(ZSTD);
  alter table Event_OnShot add column ping2 UInt16 CODEC(ZSTD);
  
  alter table Event_OnShot update hitSegment2 = ifNull(toUInt128(hitSegment), 0) where true;
  alter table Event_OnShot update ping2 = toUInt16(max2(min2(ping * 1000, 65535), 0)) where true;
  
  alter table Event_OnShot drop column hitSegment;
  alter table Event_OnShot drop column ping;
  
  alter table Event_OnShot rename column ping2 to ping;
  alter table Event_OnShot rename column hitSegment2 to hitSegment;
  
  
  alter table Event_OnShot modify column id UInt128 CODEC(ZSTD);
  alter table Event_OnShot modify column localtime DateTime64(3) CODEC(Delta, ZSTD);
  alter table Event_OnShot modify column dateTime DateTime64(3) CODEC(Delta, ZSTD);
  alter table Event_OnShot modify column battleTime DateTime64(3) CODEC(Delta, ZSTD);
  `,
  down: `
  `
} as MigrationData
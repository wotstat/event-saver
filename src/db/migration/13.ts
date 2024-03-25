import type { MigrationData } from "../migration";

export default {
  name: "13",
  up: `
    alter table Event_OnShot modify column \`results.flags\` Array(UInt32) 
      COMMENT 'Флаги результата выстрела. VEHICLE_HIT_FLAGS https://github.com/StranikS-Scan/WorldOfTanks-Decompiled/blob/a073ff6fab4bdb9a915560cb3c774e645ea9ed64/source/res/scripts/common/constants.py#L1309';
  `,
  down: `
  `
} as MigrationData
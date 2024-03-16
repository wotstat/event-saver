import type { MigrationData } from "../migration";

export default {
  name: "11",
  up: `
  alter table Event_OnShot modify column battleTime Int32 CODEC(Delta, ZSTD);
  `,
  down: `
  `
} as MigrationData
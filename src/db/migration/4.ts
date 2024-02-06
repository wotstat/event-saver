import type { MigrationData } from "../migration";

export default {
  name: "4",
  up: `alter table Event_OnShot alter column shellSpeed type Decimal32(2);`,
  down: ``
} as MigrationData


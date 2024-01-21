import type { MigrationData } from "../migration";

export default {
  name: "2",
  up: `
  create view if not exists description as
  select table, name, type, comment
  from system.columns
  where database = 'WOT'
    and table != 'migrations'
    and table != 'description';
  `,
  down: `
  drop view if exists description;
  `
} as MigrationData
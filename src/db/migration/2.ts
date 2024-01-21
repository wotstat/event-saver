import type { MigrationData } from "../migration";

export default {
  name: "2",
  up: `
  create view if not exists description as
    select name, type, comment
    from system.columns
    where database = 'WOT'
      and table != 'migrations';
  `,
  down: `
  drop view if exists description;
  `
} as MigrationData
import type { MigrationData } from "../migration";


function getQuert(table: string) {
  return `
  alter table ${table} add column if not exists modVersion_parts Array(String) materialized extractAllGroups(modVersion, '^(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?(?:-([0-9A-Za-z-.]+))?$')[1] comment 'Части версии мода major.minor.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_major UInt16 materialized toUInt16(modVersion_parts[1])    comment 'Часть версии мода MAJOR.minor.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_minor UInt16 materialized toUInt16(modVersion_parts[2])    comment 'Часть версии мода major.MINOR.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_patch UInt16 materialized toUInt16(modVersion_parts[3])    comment 'Часть версии мода major.minor.PATCH.revision-identifier';
  alter table ${table} add column if not exists modVersion_revision UInt16 materialized toUInt16(modVersion_parts[4]) comment 'Часть версии мода major.minor.patch.REVISION-identifier';
  alter table ${table} add column if not exists modVersion_identifier String materialized modVersion_parts[5]         comment 'Часть версии мода major.minor.patch.revision-IDENTIFIER';
  `
}

export default {
  name: "6",
  up: `
  ${getQuert('Event_OnBattleStart')}
  ${getQuert('Event_OnShot')}
  ${getQuert('Event_OnBattleResult')}
  `,
  down: ``
} as MigrationData


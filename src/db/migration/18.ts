import type { MigrationData } from "../migration";


function getQuery(table: string) {
  return `
  alter table ${table} add column if not exists modVersion_parts Array(String) materialized extractAllGroups(modVersion, '^(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?(?:-([0-9A-Za-z-.]+))?$')[1] comment 'Части версии мода major.minor.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_major UInt16 materialized toUInt16(modVersion_parts[1])    comment 'Часть версии мода MAJOR.minor.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_minor UInt16 materialized toUInt16(modVersion_parts[2])    comment 'Часть версии мода major.MINOR.patch.revision-identifier';
  alter table ${table} add column if not exists modVersion_patch UInt16 materialized toUInt16(modVersion_parts[3])    comment 'Часть версии мода major.minor.PATCH.revision-identifier';
  alter table ${table} add column if not exists modVersion_revision UInt16 materialized toUInt16(modVersion_parts[4]) comment 'Часть версии мода major.minor.patch.REVISION-identifier';
  alter table ${table} add column if not exists modVersion_identifier String materialized modVersion_parts[5]         comment 'Часть версии мода major.minor.patch.revision-IDENTIFIER';
  `
}

function getQueryGameVersion(table: string) {
  return `
  alter table ${table} add column if not exists gameVersion_parts Array(String) materialized extractAllGroups(gameVersion, '^(\\w+)\\_(\\d+)\\.(\\d+)(?:\\.(\\d+))?(?:_([0-9A-Za-z-.]+))?$')[1] comment 'Части версии игры prefix_major.minor.patch_identifier';
  alter table ${table} add column if not exists gameVersion_prefix UInt16 materialized toUInt16(gameVersion_parts[2])   comment 'Часть версии игры PREFIX_major.minor.patch_identifier';
  alter table ${table} add column if not exists gameVersion_major UInt16 materialized toUInt16(gameVersion_parts[2])    comment 'Часть версии игры prefix_MAJOR.minor.patch_identifier';
  alter table ${table} add column if not exists gameVersion_minor UInt16 materialized toUInt16(gameVersion_parts[3])    comment 'Часть версии игры prefix_major.MINOR.patch_identifier';
  alter table ${table} add column if not exists gameVersion_patch UInt16 materialized toUInt16(gameVersion_parts[4])    comment 'Часть версии игры prefix_major.minor.PATCH_identifier';
  alter table ${table} add column if not exists gameVersion_identifier String materialized gameVersion_parts[5]         comment 'Часть версии игры prefix_major.minor.patch_IDENTIFIER';
  alter table ${table} add column if not exists gameVersionComparable UInt32 materialized
    toUInt32(concat(leftPad(gameVersion_parts[2], 3, '0'), leftPad(gameVersion_parts[3], 3, '0'), leftPad(gameVersion_parts[4], 3, '0'), leftPad(gameVersion_parts[5], 3, '0'))) 
    comment 'Версия игры которую можно сравнивать на больше меньше';
  `
}

function modVersionComparable(table: string) {
  return `
  alter table ${table} drop column if exists modVersionComparable;
  alter table ${table} add column if not exists modVersionComparable UInt32 materialized 
  toUInt32(concat(leftPad(modVersion_parts[1], 3, '0'), leftPad(modVersion_parts[2], 3, '0'), leftPad(modVersion_parts[3], 3, '0'), leftPad(modVersion_parts[4], 3, '0')))  
  comment 'Версия игры которую можно сравнивать на больше меньше';
  `
}
export default {
  name: "18",
  up: `
  alter table Event_OnLootboxOpen add column compensatedVehicles.tag Array(String) comment 'Теги компенсированных танков';
  alter table Event_OnLootboxOpen add column compensatedVehicles.variant Array(String) comment 'Варианты компенсированных танков';
  alter table Event_OnLootboxOpen add column compensatedVehicles.gold Array(UInt32) comment 'Золото компенсированных танков';

  alter table Event_OnLootboxOpen add column if not exists region LowCardinality(String) comment 'Регион';
  alter table Event_OnLootboxOpen add column if not exists gameVersion LowCardinality(String) comment 'Версия игры';
  alter table Event_OnLootboxOpen add column if not exists modVersion LowCardinality(String) comment 'Версия мода';

  ${getQuery('Event_OnLootboxOpen')}
  ${getQueryGameVersion('Event_OnBattleResult')}
  ${getQueryGameVersion('Event_OnBattleStart')}
  ${getQueryGameVersion('Event_OnShot')}
  ${getQueryGameVersion('Event_OnLootboxOpen')}

  ${modVersionComparable('Event_OnBattleResult')}
  ${modVersionComparable('Event_OnBattleStart')}
  ${modVersionComparable('Event_OnShot')}
  ${modVersionComparable('Event_OnLootboxOpen')}
  `,
  down: `
  `
} as MigrationData
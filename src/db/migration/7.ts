import type { MigrationData } from "../migration";

function getQuert(table: string) {
  return `
  alter table ${table} add column if not exists session.startTime         DateTime64(3) comment 'Дата начала сессии по локальному времени клиента';
  alter table ${table} add column if not exists session.startAgo          UInt32 comment 'Время в секундах со старта сессии';
  alter table ${table} add column if not exists session.lastBattleAgo     UInt32 comment 'Время в секундах со старта прошлого боя';
  alter table ${table} add column if not exists session.battleStarts      UInt32 comment 'Число начатых за сессию боёв';
  alter table ${table} add column if not exists session.battleResults     UInt32 comment 'Число результатов';
  alter table ${table} add column if not exists session.winCount          UInt32 comment 'Число побед из результатов';
  alter table ${table} add column if not exists session.totalShots        UInt32 comment 'Число выстрелов';
  alter table ${table} add column if not exists session.totalShotsDamaged UInt32 comment 'Число выстрелов с уроном';
  alter table ${table} add column if not exists session.totalShotsHit     UInt32 comment 'Число попавших по танкам';
  alter table ${table} add column if not exists session.lastResult        Array(Enum8('win', 'lose', 'tie')) comment 'Результаты за прошлые 10 боёв (победа/поражение/ничья)';
  alter table ${table} add column if not exists session.lastXpPlace       Array(UInt8) comment 'Место в команде по опыту за последние 10 результатов';
  alter table ${table} add column if not exists session.lastDmgPlace      Array(UInt8) comment 'Место в команде по урону за последние 10 результатов';
  
  
  alter table ${table} add column if not exists modVersionComparable UInt32 materialized modVersion_major * 1e9 + modVersion_minor * 1e6 + modVersion_patch * 1e3 + modVersion_revision comment 'Версия мода которую можно сравнивать на больше меньше major*1e9 + minor*1e6 + patch*1e3 + revision';
  `
}

export default {
  name: "7",
  up: `
  alter table Event_OnBattleResult add column if not exists arenaId UInt64 comment 'Id арены из танков' after dateTime;

  ${getQuert('Event_OnBattleResult')}
  ${getQuert('Event_OnBattleStart')}
  ${getQuert('Event_OnShot')}

  `,
  down: ``
} as MigrationData


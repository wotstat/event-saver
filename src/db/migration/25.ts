import type { MigrationData } from "../migration";

export default {
  name: "25",
  up: `
    alter table Event_OnBattleStart add column localeTime DateTime64(3)  COMMENT 'Время события у клиента' CODEC(Delta(8), ZSTD(1)) after dateTime;
    alter table Event_OnBattleResult add column localeTime DateTime64(3)  COMMENT 'Время события у клиента' CODEC(Delta(8), ZSTD(1)) after dateTime;
    alter table Event_OnLootboxOpen add column localeTime DateTime64(3)  COMMENT 'Время события у клиента' CODEC(Delta(8), ZSTD(1)) after dateTime;

    alter table Event_OnShot rename column localtime to localeTime;
  `,
  down: `
  `
} as MigrationData
import type { MigrationData } from "../migration";

export default {
  name: "20",
  up: `
  create table if not exists Lootboxes (
    region String,
    gameVersionFull String,
    gameVersion String,
    gameVersionHash String,
    gameVersionComp String,
    datetime DateTime,
    tag String,
    name String
  ) ENGINE = ReplacingMergeTree()
  order by (region, gameVersionFull, tag);

  create table if not exists Artefacts (
    region String,
    gameVersionFull String,
    gameVersion String,
    gameVersionHash String,
    gameVersionComp String,
    datetime DateTime,
    tag String,
    name String
  ) ENGINE = ReplacingMergeTree()
  order by (region, gameVersionFull, tag);


  create table if not exists Customizations (
    region String,
    gameVersionFull String,
    gameVersion String,
    gameVersionHash String,
    gameVersionComp String,
    datetime DateTime,
    tag String,
    name String
  ) ENGINE = ReplacingMergeTree()
  order by (region, gameVersionFull, tag);
  `,
  down: `
  `
} as MigrationData
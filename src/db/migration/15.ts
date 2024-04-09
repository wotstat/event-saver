import type { MigrationData } from "../migration";

export default {
  name: "15",
  up: `
  create table Arenas (
    region String,
    gameVersionFull String,
    gameVersion String,
    gameVersionHash String,
    tag String,
    gameplay String,
    datetime DateTime,
    gameVersionComp String,
    id UInt16,
    name String,
    season String,
    winnerIfTimeout Nullable(UInt8),
    winnerIfExtermination Nullable(UInt8),
    \`bbox.bottomLeft\` Tuple(Float32, Float32),
    \`bbox.upperRight\` Tuple(Float32, Float32),
    \`base.team\` Array(UInt8),
    \`base.positions\` Array(Array(Tuple(Float32, Float32))),
    \`spawn.team\` Array(UInt8),
    \`spawn.positions\` Array(Array(Tuple(Float32, Float32))),
    control Array(Tuple(Float32, Float32)),
    \`poi.position\` Array(Tuple(Float32, Float32)),
    \`poi.type\` Array(UInt8)
  ) ENGINE = ReplacingMergeTree()
  order by (region, gameVersionFull, tag, gameplay);
  `,
  down: `
  `
} as MigrationData
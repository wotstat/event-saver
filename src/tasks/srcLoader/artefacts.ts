import { clickhouse } from "@/db";
import type { GameVersion } from ".";
import { GetText } from "./GetText"


export async function load(root: string, region: string, version: GameVersion) {
  const i18n = new GetText(await Bun.file(`${root}/sources/res/text/lc_messages/artefacts.po`).text())

  const artefacts =
    Array.from(i18n.getAll().entries())
      .filter(t => t[0].includes('/name'))

  const insertValues = artefacts.map(t => ({
    region,
    gameVersionFull: version.full,
    gameVersion: version.version,
    gameVersionHash: version.hash,
    gameVersionComp: version.comparable,
    datetime: Math.round(new Date().getTime() / 1000),

    tag: t[0].replace('/name', ''),
    name: t[1]
  }))

  console.log('Inserting artefacts...');
  await clickhouse.insert({
    table: 'Artefacts',
    values: insertValues,
    format: 'JSONEachRow'
  })
  console.log(`Artefacts inserted for: ${region}`);

}
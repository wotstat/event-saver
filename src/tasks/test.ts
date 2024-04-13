import { clickhouse } from "@/db";


const tagById = {
  21329: 'uk:GB110_FV4201_Chieftain_Prototype_B',
  34081: 'usa:A149_AMBT',
  34337: 'usa:A146_TL_7_120',
  35105: 'usa:A140_ASTRON_REX_105mm',
  37393: 'germany:G164_Kpz_Pr_68_P',
  44289: 'ussr:R165_Object_703_II',
  50337: 'italy:It30_CC_mod_64_Prem',
  51105: 'italy:It18_Progetto_C45_mod_71',
  51793: 'uk:GB110_FV4201_Chieftain_Prototype',
  53345: 'japan:J31_Type_5_KaRi',
  53793: 'usa:A81_T95_E2'

}

async function test() {
  const t = await clickhouse.query({
    query: `
    select id, raw.vehicles from Event_OnLootboxOpen where gold not in (0, 100, 250, 500, 750) and modVersion = '1.3.1.0'
  ` })
  const tj = await t.json() as any

  const size = tj.data.length
  let i = 0
  for (const line of tj.data) {

    const vehicles = line['raw.vehicles'] as any
    const entries = Object.entries(vehicles[0]) as [string, any][]
    const pairs = entries
      .filter(([key, value]) => key in tagById)
      .filter(([key, value]) => value['customCompensation'] && value['customCompensation'].length > 0)
      .map(([key, value]) => {
        const compensation = value['customCompensation']
        const name = tagById[key]

        return { name, compensation }
      })

    if (pairs.length === 0) continue

    const names = pairs.map(({ name, compensation }) => name)
    const compensations = pairs.map(({ name, compensation }) => compensation)

    const query = `
    alter table Event_OnLootboxOpen update
    \`compensatedVehicles.tag\` = [${names.map(n => `'${n}'`).join(',')}],
    \`compensatedVehicles.variant\` = [${names.map(n => `'normal'`).join(',')}],
    \`compensatedVehicles.gold\` = [${compensations.map(c => c[1]).join(',')}],
    modVersion = '1.3.1.0-f1'
    where id = '${line.id}'
    `

    const res = await clickhouse.exec({ query: query })
    console.log(`${i++} / ${size}`, line.id)
  }

  console.log('done');


}

test()
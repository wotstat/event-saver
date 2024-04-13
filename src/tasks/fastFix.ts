import { clickhouse } from "@/db";
import { BallisticCalculator } from "@/utils/ballisticCalc";


const STEP = Number.parseInt(Bun.env.STEP as any) || 1000
const LAST = '17129750381720000007636'

async function test() {

  const total = (await (await clickhouse.query({
    query: `select toUInt32(count()) as c from BallisticFixData where id < ${LAST}`
  })).json<any>()).data[0].c

  console.log(`total: ${total}`);

  const lastTimes = []


  let lastId = '0'
  let lastCount = 1
  let loaded = 0
  while (lastCount > 0) {
    performance.mark('start-load')
    const response = await clickhouse.query({
      query: `
      select * from BallisticFixData
      where id < ${LAST} and id > '${lastId}'
      order by id
      limit ${STEP};
    ` })
    performance.mark('end-load')

    const data = (await response.json() as any).data as {
      id: string,
      shellSpeed: number,
      tracerStart_x: number,
      tracerStart_y: number,
      tracerStart_z: number,
      tracerVel_x: number,
      tracerVel_y: number,
      tracerVel_z: number,
      clientMarkerPoint_x: number,
      clientMarkerPoint_y: number,
      clientMarkerPoint_z: number,
      serverMarkerPoint_x: number,
      serverMarkerPoint_y: number,
      serverMarkerPoint_z: number,
      gravity: number,
      gunPoint_x: number,
      gunPoint_y: number,
      gunPoint_z: number,
      serverShotDispersion: number,
      clientShotDispersion: number
    }[]

    lastCount = data.length
    if (lastCount === 0) break
    lastId = data[data.length - 1].id
    loaded += lastCount

    performance.mark('start')
    const fixed = data.map(t => {
      const tracerStart = { x: t.tracerStart_x, y: t.tracerStart_y, z: t.tracerStart_z }
      const tracerVel = { x: t.tracerVel_x, y: t.tracerVel_y, z: t.tracerVel_z }
      const gunPoint = { x: t.gunPoint_x, y: t.gunPoint_y, z: t.gunPoint_z }
      const clientMarkerPoint = { x: t.clientMarkerPoint_x, y: t.clientMarkerPoint_y, z: t.clientMarkerPoint_z }
      const serverMarkerPoint = { x: t.serverMarkerPoint_x, y: t.serverMarkerPoint_y, z: t.serverMarkerPoint_z }

      const shared = {
        gravity: -t.gravity,
        gunPos: gunPoint,
        shellSpeed: t.shellSpeed * 0.8,
        tracerStart,
        tracerVelocity: tracerVel,
      }

      let clientBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null
      let serverBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null

      try {
        clientBallistic = BallisticCalculator.calculate({
          ...shared,
          markerPos: clientMarkerPoint,
          dispersionAngle: t.clientShotDispersion,
        })
      } catch (error) {
        console.error(`Error calculating client ballistic: ${error}. Event: ${JSON.stringify(t)}`)
      }

      try {
        serverBallistic = BallisticCalculator.calculate({
          ...shared,
          markerPos: serverMarkerPoint,
          dispersionAngle: t.serverShotDispersion,
        })
      } catch (error) {
        console.error(`Error calculating server ballistic: ${error}. Event: ${JSON.stringify(t)}`)
      }

      if (clientBallistic === null || serverBallistic === null) return null

      return {
        id: t.id,
        ballisticResultClient_r: clientBallistic.r,
        ballisticResultClient_theta: clientBallistic.theta,
        ballisticResultServer_r: serverBallistic.r,
        ballisticResultServer_theta: serverBallistic.theta,
      }
    })
      .filter(t => t !== null)
    performance.mark('end')

    performance.mark('insert')
    await clickhouse.insert({
      table: 'BallisticFixJoin',
      values: fixed,
      format: 'JSONEachRow',
      clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 0,
      }
    })
    performance.mark('end-insert')

    const load = Math.round(performance.measure('load', 'start-load', 'end-load').duration)
    const process = Math.round(performance.measure('process', 'start', 'end').duration)
    const insert = Math.round(performance.measure('insert', 'insert', 'end-insert').duration)
    const totalTime = Math.round(performance.measure('totalTime', 'start-load', 'end-insert').duration)

    lastTimes.push(totalTime)
    if (lastTimes.length > 10) lastTimes.shift()

    const avgLoad = lastTimes.reduce((a, b) => a + b, 0) / lastTimes.length
    const ETA = avgLoad * (total - loaded) / STEP / 1000 / 60

    console.log(`done ${loaded} / ${total} (${Math.round(loaded / total * 10000) / 100}%); ${totalTime}ms, load: ${load}ms, process: ${process}ms, insert: ${insert}m; ETA: ${ETA.toFixed(2)}m`);
  }


  console.log('done');


}

async function test2() {
  const id = '17107555812980000066336'

  const response = await clickhouse.query({
    query: `
    select * from BallisticFixData
    where id = '${id}';
  ` })

  const data = (await response.json() as any).data as {
    id: string,
    shellSpeed: number,
    tracerStart_x: number,
    tracerStart_y: number,
    tracerStart_z: number,
    tracerVel_x: number,
    tracerVel_y: number,
    tracerVel_z: number,
    clientMarkerPoint_x: number,
    clientMarkerPoint_y: number,
    clientMarkerPoint_z: number,
    serverMarkerPoint_x: number,
    serverMarkerPoint_y: number,
    serverMarkerPoint_z: number,
    gravity: number,
    gunPoint_x: number,
    gunPoint_y: number,
    gunPoint_z: number,
    serverShotDispersion: number,
    clientShotDispersion: number
  }[]

  console.log(data);


  const fixed = data.map(t => {
    const tracerStart = { x: t.tracerStart_x, y: t.tracerStart_y, z: t.tracerStart_z }
    const tracerVel = { x: t.tracerVel_x, y: t.tracerVel_y, z: t.tracerVel_z }
    const gunPoint = { x: t.gunPoint_x, y: t.gunPoint_y, z: t.gunPoint_z }
    const clientMarkerPoint = { x: t.clientMarkerPoint_x, y: t.clientMarkerPoint_y, z: t.clientMarkerPoint_z }
    const serverMarkerPoint = { x: t.serverMarkerPoint_x, y: t.serverMarkerPoint_y, z: t.serverMarkerPoint_z }

    const shared = {
      gravity: -t.gravity,
      gunPos: gunPoint,
      shellSpeed: t.shellSpeed * 0.8,
      tracerStart,
      tracerVelocity: tracerVel,
    }

    let clientBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null
    let serverBallistic: ReturnType<typeof BallisticCalculator.calculate> | null = null

    try {
      clientBallistic = BallisticCalculator.calculate({
        ...shared,
        markerPos: clientMarkerPoint,
        dispersionAngle: t.clientShotDispersion,
      })
    } catch (error) {
      console.error(`Error calculating client ballistic: ${error}. Event: ${JSON.stringify({
        gravity: t.gravity,
        gunPoint: gunPoint,
        shellSpeed: t.shellSpeed,
        tracerStart,
        tracerVel,
        clientMarkerPoint,
        clientShotDispersion: t.clientShotDispersion,
        serverMarkerPoint,

      })}`)
    }

    try {
      serverBallistic = BallisticCalculator.calculate({
        ...shared,
        markerPos: serverMarkerPoint,
        dispersionAngle: t.serverShotDispersion,
      })
    } catch (error) {
      console.error(`Error calculating server ballistic: ${error}. Event: ${JSON.stringify(t)}`)
    }

    console.log(clientBallistic, serverBallistic);

  })

}

test2()
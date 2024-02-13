import { createClient, type ClickHouseSettings } from '@clickhouse/client-web'
import type { WebClickHouseClient } from '@clickhouse/client-web/dist/client'

// declare module '@clickhouse/client-web' {
//   interface ResultSet {
//     json<T>(): Promise<{
//       meta: {
//         name: string,
//         type: string
//       }[]
//       data: T,
//       rows: number,
//       statistics: {
//         elapsed: number,
//         rows_read: number,
//         bytes_read: number
//       }
//     }>
//   }
// }

const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE,
  request_timeout: 1000,
  keep_alive: { enabled: false },
})

async function connect(options: { timeout?: number }) {
  const timeout = options.timeout ?? 0;
  const delay = 0.5;

  for (let i = 0; i <= timeout; i += delay) {
    try {
      const ping = await clickhouse.query({ query: `select 1;` })
      if (ping && ping.query_id) {
        console.log('ClickHouse connected');
        return true
      }
    } catch (e: any) {
      if (i == 0) console.log(`ClickHouse is not available: ${e?.message}, retrying...`);
    }
    await new Promise(r => setTimeout(r, delay * 1000))
  }
  return false;
}

async function multistatementQuery(client: WebClickHouseClient, query: string, options?: ClickHouseSettings) {
  const queries = query.split(';')
    .map(t => t.replaceAll('\n', '').trim())
    .filter(t => t != '')

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    await client.query({
      query: q,
      clickhouse_settings: options
    });
  }
}


export { clickhouse, multistatementQuery, connect }

import { createClient, type ClickHouseSettings } from '@clickhouse/client'

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE,
  request_timeout: 120000,
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

export { clickhouse, connect }

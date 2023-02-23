import { ClickHouseClient, createClient } from '@clickhouse/client'

declare module '@clickhouse/client' {
  interface ResultSet {
    json<T>(): Promise<{
      meta: {
        name: string,
        type: string

      }[]
      data: T,
      rows: number,
      statistics: {
        elapsed: number,
        rows_read: number,
        bytes_read: number
      }
    }>
  }
}

const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE
})

async function multistatementQuery(client: ClickHouseClient, query: string) {
  const queries = query.split(';').filter(t => t.trim() != '')
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    await client.query({ query: q });
  }
}


export { clickhouse, multistatementQuery }


import { clickhouse } from '@/db/index.js'

export function insert(tableName: string, data: any) {
  clickhouse.insert({
    table: tableName,
    values: data,
    format: 'JSONEachRow',
    clickhouse_settings: {
      async_insert: 1,
      wait_for_async_insert: 0,
      async_insert_busy_timeout_ms: 500,
    }
  })
}

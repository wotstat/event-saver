
import { clickhouse } from '@/db/index.js'

let insertFunc = (tableName: string, data: any) => {
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

if (process.env.DEBUG) {
  insertFunc = (tableName: string, data: any) => {
    clickhouse.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow'
    })
  }
}


export function insert(tableName: string, data: any) {
  insertFunc(tableName, data)
}


import { clickhouse } from '@/db/index.js'
import { debug } from '@/utils/utils.js'

let insertFunc = async (tableName: string, data: any) => {
  try {
    await clickhouse.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow',
      clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 0,
        async_insert_busy_timeout_ms: 500,
      }
    })
  } catch (e) {
    debug(`Insert error ${e}`)
  }
}

if (process.env.DEBUG) {
  insertFunc = async (tableName: string, data: any) => {
    try {
      await clickhouse.insert({
        table: tableName,
        values: data,
        format: 'JSONEachRow'
      })
    } catch (e) {
      console.error(e)
    }
  }
}


export function insert(tableName: string, data: any) {
  // console.log(`insert into ${tableName}`, data);
  insertFunc(tableName, data)
}

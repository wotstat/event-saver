
import { clickhouse } from '@/db/index'
import type { ClickHouseSettings } from '@clickhouse/client-web'

const asyncInsertSettings = {
  async_insert: 1,
  wait_for_async_insert: 0,
  async_insert_busy_timeout_ms: 500,
} satisfies ClickHouseSettings

async function insertFunc(tableName: string, data: any, event: any) {
  try {
    await clickhouse.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow',
      clickhouse_settings: Bun.env.ASYNC_INSERT ? asyncInsertSettings : undefined
    })
  } catch (e) {
    console.error(e)
    console.error(`insert into ${tableName}`, data);
    console.error(`event for inserting ${tableName}`, JSON.stringify(event));
  }
}


export function insert(tableName: string, data: any, event: any) {
  insertFunc(tableName, data, event)
}


import { clickhouse } from '@/db/index'
import { logger } from '@/logger'
import type { ClickHouseSettings } from '@clickhouse/client'

const asyncInsertSettings = {
  async_insert: 1,
  wait_for_async_insert: 1
} satisfies ClickHouseSettings

const insertCache: { [key: string]: any } = {}

async function insertLoop() {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const keys = Object.keys(insertCache)
    if (keys.length === 0) continue

    for (const key of keys) {
      const data = insertCache[key]
      delete insertCache[key]

      try {
        await clickhouse.insert({
          table: key,
          values: data,
          format: 'JSONEachRow',
          clickhouse_settings: Bun.env.ASYNC_INSERT ? asyncInsertSettings : undefined
        })
      } catch (error) {
        logger.error({ error, table: key, data: JSON.stringify(data) }, `Error inserting into ${key}: ${(error as Error).message}`)
      }
    }
  }
}

insertLoop()

async function insertFunc(tableName: string, data: any, event: any) {
  if (!insertCache[tableName]) insertCache[tableName] = []
  insertCache[tableName].push(data)
}


export function insert(tableName: string, data: any, event: any) {
  insertFunc(tableName, data, event)
}

export async function insertNow(tableName: string, data: any, event: any) {
  try {
    await clickhouse.insert({
      table: tableName,
      values: data,
      format: 'JSONEachRow',
      clickhouse_settings: asyncInsertSettings
    })
  } catch (error) {
    logger.error({ error, table: tableName, data: JSON.stringify(data) }, `Error inserting into ${tableName}: ${(error as Error).message}`)
  }
}

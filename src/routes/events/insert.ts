
import { clickhouse } from '@/db/index.js'

export function insert(tableName: string, data: any) {
  clickhouse.insert({
    table: tableName,
    values: data,
    format: 'JSONEachRow'
  })
}

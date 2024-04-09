import { ClickHouseClient } from '@clickhouse/client-web';
import { v4 } from 'uuid';
import { multistatementQuery } from './index';
import { Glob } from "bun";
import type { WebClickHouseClient } from '@clickhouse/client-web/dist/client';

export interface MigrationData {
  name: string,
  up: string,
  down: string
}

export type Migration = {
  name: string,
  uuid: string,
  date: Date,
  order: number
}

const MIGRATION_PATH = 'src/db/migration'

let migrators: MigrationData[] = []

async function loadMigrations() {
  try {
    const glob = new Glob('*.ts')
    const scannedFiles = await Array.fromAsync(glob.scan({ cwd: MIGRATION_PATH }))
    scannedFiles.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

    const modules = await Promise.all(scannedFiles.map(t => import(`./migration/${t}`)))

    return modules.map(t => t.default)
  } catch (err) {
    console.error(err);
  }
}

async function migrate(client: WebClickHouseClient) {
  migrators = await loadMigrations() || [];

  await client.query({
    query: `create table if not exists migrations (name String, uuid UUID, date DateTime64, order Int8 ) engine MergeTree() order by order;`
  })

  const currentMigrations = await (await client.query({ query: `select * from migrations order by order;`, format: 'JSONEachRow' })).json<Migration[]>()
  let lastOrder = currentMigrations.reduce((a, val) => Math.max(a, val.order), 0) ?? 0

  for (let i = 0; i < migrators.length; i++) {
    const migrator = migrators[i];
    if (!currentMigrations.find(t => t.name == migrator.name)) {
      console.log(`[Migration]: apply ${migrator.name}`);
      console.info(`[Migration]: apply ${migrator.up}`);

      try {
        await multistatementQuery(client, migrator.up, {
          mutations_sync: '2',
        })

        console.log(`[Migration]: ${migrator.name} applied`);

        await client.insert({
          table: 'migrations',
          values: {
            name: migrator.name,
            uuid: v4(),
            date: (new Date()).getTime(),
            order: ++lastOrder
          },
          format: 'JSONEachRow',
        })

        await new Promise(resolve => setTimeout(resolve, 1))
      }
      catch (e) {
        console.error(e);
      }
    }
  }
}

async function rollback(client: WebClickHouseClient) {
  migrators = await loadMigrations() || [];

  await client.query({
    query: `create table if not exists migrations (name String, uuid UUID, date DateTime64, order Int8 ) engine MergeTree() order by order;`
  })

  const currentMigrations = await (await client.query({ query: `select * from migrations order by order desc;`, format: 'JSONEachRow' })).json<Migration[]>()

  if (currentMigrations.length == 0) return;

  const migration = migrators.find(t => t.name == currentMigrations[0].name)

  if (migration) {
    console.log(`[Rollback]: migration ${migration.name}`);
    try {
      await multistatementQuery(client, migration.down)
      await client.query({ query: `alter table migrations delete where uuid = '${currentMigrations[0].uuid}'` })
    }
    catch (e) {
      console.error(e);
    }
  }
}

export { migrate, rollback }

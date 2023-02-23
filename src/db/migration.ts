import { ClickHouseClient } from '@clickhouse/client';
import glob from 'glob-promise';
import { v4 } from 'uuid';
import { multistatementQuery } from './index.js';

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

let migrators: MigrationData[] = []

async function loadMigrations() {
  try {
    const res = await glob('./src/db/migration/**/*.ts');
    const modules = await Promise.all(res.map((file) => import(file.replace('src/db/', '').replace('.ts', '.js'))))

    return modules.map(t => t.default)
  } catch (err) {
    console.error(err);
  }
}

async function migrate(client: ClickHouseClient) {
  migrators = await loadMigrations() || [];

  await client.query({
    query: `create table if not exists migrations (name String, uuid UUID, date DateTime64, order Int8 ) engine MergeTree() order by order;`
  })

  const currentMigrations = await (await client.query({ query: `select * from migrations order by order;` })).json<Migration[]>()

  let lastOrder = currentMigrations.data.reduce((a, val) => Math.max(a, val.order), 0) || 0


  for (let i = 0; i < migrators.length; i++) {
    const migrator = migrators[i];
    if (!currentMigrations.data.find(t => t.name == migrator.name)) {
      console.log(`[Migration]: apply ${migrator.name}`);

      try {
        await multistatementQuery(client, migrator.up)

        await client.insert({
          table: 'migrations',
          values: {
            name: migrator.name,
            uuid: v4(),
            date: (new Date()).getTime(),
            order: ++lastOrder
          },
          format: 'JSONEachRow'
        })
      }
      catch (e) {
        console.error(e);
      }
    }
  }
}

async function rollback(client: ClickHouseClient) {
  migrators = await loadMigrations() || [];

  await client.query({
    query: `create table if not exists migrations (name String, uuid UUID, date DateTime64, order Int8 ) engine MergeTree() order by order;`
  })

  const currentMigrations = await (await client.query({ query: `select * from migrations order by order desc;` })).json<Migration[]>()

  if (currentMigrations.data.length == 0) return;

  const migration = migrators.find(t => t.name == currentMigrations.data[0].name)

  if (migration) {
    console.log(`[Rollback]: migration ${migration.name}`);
    try {
      await multistatementQuery(client, migration.down)
      await client.query({ query: `alter table migrations delete where uuid = '${currentMigrations.data[0].uuid}'` })
    }
    catch (e) {
      console.error(e);
    }
  }
}

export { migrate, rollback }

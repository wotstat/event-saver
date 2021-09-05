import { MultistatementQuery } from '../index.js'
import M_1 from './1.js'


const migrators = [M_1]

async function Migrate(client) {

    await client.query(`create table if not exists migrations (name String, uuid UUID, date DateTime64, order Int8 ) engine MergeTree() order by order;`).toPromise()

    const currentMigrations = await client.query(`select * from migrations order by order;`).toPromise()
    let lastOrder = currentMigrations.reduce((a, val) => Math.max(a, val.order), 0) || 0


    for (let i = 0; i < migrators.length; i++) {
        const migrator = migrators[i];
        if (!currentMigrations.find(t => t.name == migrator.name)) {
            console.log(`[Migration]: apply ${migrator.name}`);

            try {
                await MultistatementQuery(client, migrator.up)
                await client.query(`insert into migrations (name, uuid, date, order)
                VALUES ('${migrator.name}', generateUUIDv4(), '${(new Date()).getTime()}', ${++lastOrder})`).toPromise()
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}

async function Rollback(client) {
    const currentMigrations = await client.query(`select * from migrations order by order desc;`).toPromise()
    if (currentMigrations.length > 0) {
        const migration = migrators.find(t => t.name == currentMigrations[0].name)
        console.log(`[Rollback]: migration ${migration.name}`);
        try {
            await MultistatementQuery(client, migration.down)
            await client.query(`alter table migrations delete where uuid = '${currentMigrations[0].uuid}'`).toPromise()
        }
        catch (e) {
            console.error(e);
        }
    }
}

export { Migrate, Rollback }

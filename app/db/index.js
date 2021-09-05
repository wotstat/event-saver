import config from 'config'
import clickHouse from 'clickhouse'
import Knex from 'knex'

const knex = Knex({ client: 'pg' });

const clickhouse = new clickHouse.ClickHouse(config.get('clickHouse'))

async function MultistatementQuery(client, sql) {
    const querys = sql.split(';').filter(t => t.trim() != '')
    const res = []
    for (let i = 0; i < querys.length; i++) {
        const query = querys[i];
        res.push(await client.query(query).toPromise())
    }
    return res
}

export { knex, clickhouse, MultistatementQuery }

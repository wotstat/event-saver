
import config from 'config'
import clickHouse from "clickhouse"
import Knex from 'knex'


const knex = Knex({ client: 'pg' });

const clickhouse = new clickHouse.ClickHouse(config.get('clickHouse'))


function Insert(table, values) {

    const sql = knex.into(table).insert(values).toString()
    console.log(sql);
    clickhouse.query(sql).exec((err, rows) => { })
}

export { Insert }

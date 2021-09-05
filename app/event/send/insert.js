import { knex, clickhouse } from '../../db/index.js'

function Insert(table, values) {

    const sql = knex.into(table).insert(values).toString()
    console.log(sql);
    clickhouse.query(sql).exec((err, rows) => { })
}

export { Insert }

import { knex, clickhouse } from '../../db/index.js'
import { Vector3Unwrap, CHBool, CHArray, S2MS } from './utils.js'

function Insert(table, values) {

    values = Object.keys(values).reduce((a, v) => {
        const val = values[v];

        if (typeof (val) == typeof (false)) {
            a[v] = CHBool(val)
        } else if (Array.isArray(val)) {
            a[v] = knex.raw(CHArray(val))
        } else {
            a[v] = val
        }

        return a
    }, {})
    const sql = knex.into(table).insert(values).toString()
    console.log(sql);
    clickhouse.query(sql).exec((err, rows) => { })
}

export { Insert }

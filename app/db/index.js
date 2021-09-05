import config from 'config'
import clickHouse from 'clickhouse'
import Knex from 'knex'
import { Migrate } from './migration/index.js';

const knex = Knex({ client: 'pg' });

const clickhouse = new clickHouse.ClickHouse(config.get('clickHouse'))

Migrate(clickhouse)

export { knex, clickhouse }
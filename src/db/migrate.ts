import { migrate } from './migration.js';
import { createClient } from '@clickhouse/client'

const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE
})

migrate(clickhouse)
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error(error);
  })

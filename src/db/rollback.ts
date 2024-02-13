import { rollback } from './migration';
import { createClient } from '@clickhouse/client-web'

const clickhouse = createClient({
  host: Bun.env.CLICKHOUSE_HOST,
  username: Bun.env.CLICKHOUSE_USER,
  password: Bun.env.CLICKHOUSE_PASSWORD,
  database: Bun.env.CLICKHOUSE_DATABASE,
  keep_alive: { enabled: false },
})

rollback(clickhouse)
  .then(() => {
    console.log('Done');
  })
  .catch(error => {
    console.error(error);
  })

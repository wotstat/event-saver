import { Hono } from "hono";
import { cors } from 'hono/cors'

import routes from './routes';
import { migrate } from './db/migration'
import { connect, clickhouse } from './db/index'
import { redis } from './redis/index'

const hono = new Hono();
hono.use(cors());

hono.route('/', routes);

try {
  console.log('Connecting to ClickHouse...');

  if (!await connect({ timeout: 10 })) {
    throw new Error('ClickHouse is not available')
  }

  console.log('Connecting to Redis...');

  await Promise.all([
    migrate(clickhouse),
    redis.connect()
  ])

  console.log(`Server is listening on port ${Bun.env.PORT}`);
}
catch (e: any) {
  console.error(`Server error: ${e.message}`)
  process.exit(1)
}

export default {
  port: Bun.env.PORT,
  fetch: hono.fetch,
}
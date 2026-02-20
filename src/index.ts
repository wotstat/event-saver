import { Hono } from "hono";
import { cors } from 'hono/cors'

import routes from './routes';
import { connect } from './db/index'
import { redis } from './redis/index'
import { logger } from "./logger";

const hono = new Hono();
hono.use(cors());

hono.route('/', routes);

try {
  logger.info('Connecting to ClickHouse...');

  if (!await connect({ timeout: 10 })) {
    throw new Error('ClickHouse is not available')
  }

  logger.info('Connecting to Redis...');
  await redis.connect()

  logger.info(`Server is listening on port ${Bun.env.PORT}`);
}
catch (e: any) {
  logger.error({ error: e.message }, `Server error: ${e.message}`)
  process.exit(1)
}

export default {
  port: Bun.env.PORT,
  fetch: hono.fetch,
}
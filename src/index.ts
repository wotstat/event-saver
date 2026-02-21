import { Hono } from "hono";
import { cors } from 'hono/cors'

import routes from './routes';
import { connect } from './db/index'
import { redis } from './redis/index'
import { logger, ready as loggerReady } from "./logger";


const hono = new Hono();
hono.use(cors());

hono.route('/', routes);

async function connectLoki() {
  try {
    console.log('Connecting to Loki...');
    await loggerReady()
    console.log('Loki is ready');
  } catch (error) {
    console.error('Failed to connect to Loki:', error);
  }
}

connectLoki()

try {

  logger.info('Connecting to ClickHouse...');
  logger.warn('This is a warning message');

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
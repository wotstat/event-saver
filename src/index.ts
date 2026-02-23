import { Hono } from 'hono'
import { cors } from 'hono/cors'

import routes from './routes'
import { connect as clickhouseConnect } from './db/index'
import { redis } from './redis/index'
import { logger, connect as loggerConnect } from './logger'


const hono = new Hono()
hono.use(cors())

hono.route('/', routes)

try {
  console.log('Connecting to Loki...')
  if (!await loggerConnect()) {
    throw new Error('Loki is not available')
  }

  logger.info('Connecting to ClickHouse...')
  if (!await clickhouseConnect({ timeout: 10 })) {
    throw new Error('ClickHouse is not available')
  }

  logger.info('Connecting to Redis...')
  await redis.connect()

  logger.info(`Server is listening on port ${Bun.env.PORT}`)
}
catch (error: any) {
  logger.error({ error }, `Server error: ${error.message}`)
  console.error(`Server error: ${error.message}`)
  await new Promise(resolve => logger.flush(() => resolve(true)))

  process.exit(1)
}

export default {
  port: Bun.env.PORT,
  fetch: hono.fetch,
}
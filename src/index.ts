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
}
catch (error: any) {
  logger.error({ error }, `Server error: ${error.message}`)
  console.error(`Server error: ${error.message}`)
  await new Promise(resolve => logger.flush(() => resolve(true)))

  process.exit(1)
}

const server = Bun.serve({
  port: Bun.env.PORT,
  fetch: hono.fetch,
})

logger.info(`Server is listening on port ${server.port}`)

let shuttingDown = false
async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true

  logger.info(`${signal} received, draining requests...`)

  // перестаём принимать новые соединения и дожидаемся in-flight запросов,
  // но не дольше 8 секунд (docker пришлёт SIGKILL через stop_grace_period)
  await Promise.race([
    server.stop(),
    new Promise(resolve => setTimeout(resolve, 8000)),
  ])

  // даём завершиться fire-and-forget вставкам в ClickHouse
  await new Promise(resolve => setTimeout(resolve, 2000))
  await new Promise(resolve => logger.flush(() => resolve(true)))
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
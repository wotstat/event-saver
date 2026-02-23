import pino from 'pino'
import type { PrettyOptions } from 'pino-pretty'
import { createLokiTransport } from './loki-transport'

const isDevelopment = Boolean(Bun.env.DEVELOPMENT)
const LOKI_HOST = Bun.env.LOKI_HOST || 'http://127.0.0.1:3100'

export async function connect(attempts = 5) {
  if (isDevelopment) return true

  try {

    const res = await fetch(`${LOKI_HOST}/ready`)
    if (res.status !== 200) return false
    return true

  } catch (err) {
    if (attempts > 0) {
      console.log(`Loki is not ready. Retrying... (${5 - attempts + 1}/5)`)
      return await connect(attempts - 1)
    } else {
      return false
    }
  }
}

const lokiTransport = createLokiTransport({
  host: LOKI_HOST,
  labels: { source: 'event-saver' },
  structuredMetaKey: 'meta',

})

const prettyTransport = pino.transport<PrettyOptions>({
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
  },

})


export const logger = pino({
  errorKey: 'error'
}, isDevelopment ? prettyTransport : lokiTransport)

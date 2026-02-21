import pino from 'pino'
import type { PrettyOptions } from "pino-pretty";
import { createLokiTransport } from './loki-transport';

const isDevelopment = Boolean(Bun.env.DEVELOPMENT);
const LOKI_HOST = Bun.env.LOKI_HOST || 'http://127.0.0.1:3100';

export async function ready(attempts = 5) {
  if (isDevelopment) return true;

  try {

    const res = await fetch(`${LOKI_HOST}/ready`);
    if (res.status !== 200) throw new Error(`Loki is not ready, status code: ${res.status}`);
    return true;

  } catch (err) {
    if (attempts > 0) {
      console.log(`Loki is not ready. Retrying... (${5 - attempts + 1}/5)`);
      return await ready(attempts - 1)
    } else {
      throw new Error("Loki is not ready after multiple attempts");
    }
  }
}

const lokiTransport = createLokiTransport({
  host: LOKI_HOST,
  labels: { app: "event-saver" },
  structuredMetaKey: 'meta',
});

const prettyTransport = pino.transport<PrettyOptions>({
  target: "pino-pretty",
  options: {
    colorize: true,
    ignore: "pid,hostname",
  },
});


export const logger = isDevelopment ? pino(prettyTransport) : pino(lokiTransport)

import pino from 'pino'
import type { PrettyOptions } from "pino-pretty";
import type { LokiOptions } from 'pino-loki'

const isDevelopment = Bun.env.DEVELOPMENT === '1';

const lokiTransport = pino.transport<LokiOptions>({
  target: "pino-loki",
  options: {
    host: Bun.env.LOKI_HOST || 'http://127.0.0.1:3100',
  },
});

const prettyTransport = pino.transport<PrettyOptions>({
  target: "pino-pretty",
  options: {
    colorize: true,
    ignore: "pid,hostname",
  },
});


export const logger = isDevelopment ? pino(prettyTransport) : pino(lokiTransport)

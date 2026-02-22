import { Writable } from 'stream';

export interface LokiTransportOptions {
  /** Loki push endpoint, e.g. http://localhost:3100 */
  host: string;
  /** Static labels applied to every log stream */
  labels?: Record<string, string>;
  /** How often to flush the batch (ms). Default: 2000 */
  interval?: number;
  /** Max batch size before forced flush. Default: 100 */
  batchSize?: number;
  /** Key in log object whose value is sent as structured metadata */
  structuredMetaKey?: string;
}

const PINO_LEVELS: Record<number, string> = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
};

type LokiValue = [string, string] | [string, string, Record<string, unknown>];

interface LokiStream {
  stream: Record<string, string>;
  values: LokiValue[];
}

interface LokiPushBody {
  streams: LokiStream[];
}

export function createLokiTransport(opts: LokiTransportOptions): Writable {
  const {
    host,
    labels = {},
    interval = 2000,
    batchSize = 100,
    structuredMetaKey,
  } = opts;

  const pushUrl = `${host.replace(/\/+$/, '')}/loki/api/v1/push`;

  // batch grouped by serialised label key
  const streamMap = new Map<string, LokiStream>();
  let count = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  function getStreamKey(streamLabels: Record<string, string>): string {
    return Object.entries(streamLabels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
  }

  function enqueue(streamLabels: Record<string, string>, value: LokiValue) {
    const key = getStreamKey(streamLabels);
    let entry = streamMap.get(key);
    if (!entry) {
      entry = { stream: streamLabels, values: [] };
      streamMap.set(key, entry);
    }
    entry.values.push(value);
    count++;
  }

  async function flush() {
    if (count === 0) return;

    const body: LokiPushBody = {
      streams: Array.from(streamMap.values()),
    };

    streamMap.clear();
    count = 0;

    try {
      const res = await fetch(pushUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        process.stderr.write(`[loki-transport] push failed (${res.status}): ${text}\n`);
      }
    } catch (err) {
      process.stderr.write(`[loki-transport] push error: ${err}\n`);
    }
  }

  function startTimer() {
    if (!timer) {
      timer = setInterval(() => {
        flush();
      }, interval);
      // Allow process to exit even if timer is active
      if (timer && typeof timer === 'object' && 'unref' in timer) {
        timer.unref();
      }
    }
  }

  const stream = new Writable({
    objectMode: true,

    write(chunk: Buffer | string, _encoding, callback) {
      try {
        const raw = typeof chunk === 'string' ? chunk : chunk.toString();
        const obj = JSON.parse(raw);

        // Extract timestamp – pino gives epoch ms or ISO string
        let tsNs: string;
        if (obj.time) {
          const ms = typeof obj.time === 'number' ? obj.time : new Date(obj.time).getTime();
          tsNs = (BigInt(ms) * 1_000_000n).toString();
        } else {
          tsNs = (BigInt(Date.now()) * 1_000_000n).toString();
        }

        // Build stream labels
        const level = PINO_LEVELS[obj.level] ?? 'info';
        const streamLabels: Record<string, string> = { ...labels, level };

        // Collect structured metadata from dedicated key + all extra fields
        const structuredMeta: Record<string, unknown> = {};

        // Fields to exclude from structured metadata
        const excludeKeys = new Set(['level', 'time', 'pid', 'hostname', 'msg', 'v']);
        if (structuredMetaKey) excludeKeys.add(structuredMetaKey);

        // Extract from structuredMetaKey if present
        if (structuredMetaKey && obj[structuredMetaKey] && typeof obj[structuredMetaKey] === 'object') {
          for (const [k, v] of Object.entries(obj[structuredMetaKey])) {
            structuredMeta[k] = v;
          }
        }

        // Add all remaining extra fields as structured metadata
        for (const [k, v] of Object.entries(obj)) {
          if (excludeKeys.has(k)) continue;
          structuredMeta[k] = v;
        }

        // Build the log line as a plain string
        const msg = obj.msg ?? '';
        const logLine = String(msg);

        const hasMetadata = Object.keys(structuredMeta).length > 0;
        const value: LokiValue = hasMetadata
          ? [tsNs, logLine, structuredMeta]
          : [tsNs, logLine];

        enqueue(streamLabels, value);

        if (count >= batchSize) {
          flush();
        }

        startTimer();
        callback();
      } catch (err) {
        callback(err instanceof Error ? err : new Error(String(err)));
      }
    },

    final(callback) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      flush().then(() => callback(), callback);
    },

    destroy(_err, callback) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      flush().then(() => callback(null), () => callback(null));
    },
  });

  return stream;
}

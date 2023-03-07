export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET?: string;
      PORT?: string;
      CLICKHOUSE_HOST?: string;
      CLICKHOUSE_USER?: string;
      CLICKHOUSE_PASSWORD?: string;
      CLICKHOUSE_DATABASE?: string;
      REDIS_HOST?: string;
      REDIS_BATTLE_TOKEN_LIFETIME?: string;
      DEBUG?: string;
    }
  }
}

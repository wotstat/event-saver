export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      PORT: string;
      CLICKHOUSE_HOST: string;
      CLICKHOUSE_USER: string;
      CLICKHOUSE_PASSWORD: string;
      CLICKHOUSE_DATABASE: string;
    }
  }
}

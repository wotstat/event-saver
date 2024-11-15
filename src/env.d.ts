declare module "bun" {
  interface Env {
    readonly JWT_SECRET: string;
    readonly PORT?: string;
    readonly CLICKHOUSE_HOST: string;
    readonly CLICKHOUSE_USER: string;
    readonly CLICKHOUSE_PASSWORD: string;
    readonly CLICKHOUSE_DATABASE: string;
    readonly REDIS_HOST: string;
    readonly REDIS_BATTLE_TOKEN_LIFETIME: string;
    readonly DEBUG?: string;
    readonly ASYNC_INSERT?: string;
  }
}

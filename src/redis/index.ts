import Redis from 'redis'

export const redis = Redis.createClient({
  socket: {
    host: Bun.env.REDIS_HOST
  }
});

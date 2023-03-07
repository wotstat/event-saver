import Redis from 'redis'

export const redis = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST
  }
});

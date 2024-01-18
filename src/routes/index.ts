import { Hono } from "hono";

import eventProcessor from './events/index'

const router = new Hono();

router.get("/api", c => {
  return c.json({
    status: 'online',
    version: '1.0.1',
    env: process.env.NODE_ENV
  })
})

router.route('/api/events', eventProcessor)

export default router

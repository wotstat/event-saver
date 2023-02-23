import { Router } from "express";

import eventProcessor from './events/index.js'

const router = Router();

router.get("/api", (req, res) => {
  res.json({
    status: 'online',
    env: process.env.NODE_ENV
  })
})

router.use('/api/events', eventProcessor)

export default router

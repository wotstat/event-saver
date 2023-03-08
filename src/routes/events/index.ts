import jwt from 'jsonwebtoken'
import { Router } from "express"

import { Event } from '@/types/events.js'
import OnBattleResult from './processors/onBattleResult.js'
import OnBattleStart from './processors/onBattleStart.js'
import OnShot from './processors/onShot.js'

import { redis } from '@/redis/index.js'

import { onBattleStartSchema } from '@/types/validator.js';
import { debug, uuid, uuidToUInt128String } from '@/utils/utils.js'
import { randomBytes } from 'crypto'

const router = Router()

const lifetime = process.env.REDIS_BATTLE_TOKEN_LIFETIME ? Number.parseInt(process.env.REDIS_BATTLE_TOKEN_LIFETIME) : 30 * 60

const supportedEvents = {
  'OnBattleStart': OnBattleStart,
  'OnBattleResult': OnBattleResult,
  'OnShot': OnShot
}

function processEvent(eventName: string, event: Event) {
  if (eventName in supportedEvents) {
    const token = event.token
    const secret = process.env.JWT_SECRET as string
    jwt.verify(token, secret, (err, uuid) => {
      if (!err) {
        (supportedEvents as any)[eventName](uuid, event)
      } else {
        debug(`JWT error: ${err.message}`)
      }
    });
  } else {
    debug(`Unsupported event: ${eventName}`)
  }
}
router.post('/OnBattleStart', async (req, res) => {

  if (!onBattleStartSchema(req.body)) return res.status(400).send(process.env.DEBUG ? onBattleStartSchema.errors : undefined).end()

  const cacheKey = `${req.body.playerWotID}-${req.body.arenaID}`

  const replay = await redis.get(cacheKey)
  if (replay) {
    return res.send(replay).end()
  } else {
    const id = uuid();
    const token = jwt.sign(id, process.env.JWT_SECRET as string);
    await redis.setEx(cacheKey, lifetime, token)
    OnBattleStart(id, req.body)
    return res.send(token).end()
  }
})

router.post('/send', async (req, res) => {
  try {
    req.body.events.forEach(async (event: Event) => {
      processEvent(event.eventName, event)
    });
  }
  catch (e: any) {
    console.error(`Send Event error: ${e.message}`);
  }
  finally {
    return res.status(200).end()
  }
})




export default router

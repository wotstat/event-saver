import jwt from 'jsonwebtoken'
import { Router } from "express"
import { v4 as uuidv4 } from 'uuid'

import { Event } from '@/types/events.js'

import OnBattleResult from './processors/onBattleResult.js'

const router = Router()

const supportedEvents = {
  'OnBattleResult': OnBattleResult
}


function processEvent(eventName: string, event: Event) {
  if (eventName in supportedEvents) {
    const token = event.token
    const secret = process.env.JWT_SECRET as string
    jwt.verify(token, secret, (err, uuid) => {
      if (!err) {
        (supportedEvents as any)[eventName](uuid, event)
      }
    });
  }
}


router.post('/OnBattleStart', async (req, res) => {
  const cacheKey = `${req.body.PlayerBDID}-${req.body.ArenaID}`
  // redis.get(cacheKey, (err, replay) => {
  //     if (replay) {
  //         return res.send(replay).end()
  //     } else {
  //         const id = uuidv4();
  //         const token = jwt.sign(id, jwtSecret);
  //         redis.set(cacheKey, token, 'EX', config.get('redis').startBattleTokenLifetime)

  //         OnBattleStart(id, req.body)

  //         return res.send(token).end()
  //     }

  // })

  const id = uuidv4();

  const token = jwt.sign(id, process.env.JWT_SECRET as string);
  return res.send(token).end()
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

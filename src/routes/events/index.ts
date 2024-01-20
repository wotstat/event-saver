import { verify, sign } from 'hono/jwt'
import { Hono } from "hono"

import type { Event } from '@/types/events'
import OnBattleResult from './processors/onBattleResult'
import OnBattleStart from './processors/onBattleStart'
import OnShot from './processors/onShot'

import { redis } from '@/redis/index'

import { onBattleStartSchema } from '@/types/validator';
import { debug } from '@/utils/utils'
import { uuid } from '@/utils/uuid'
import type { BodyData } from 'hono/utils/body'

const router = new Hono()

const lifetime = process.env.REDIS_BATTLE_TOKEN_LIFETIME ? Number.parseInt(process.env.REDIS_BATTLE_TOKEN_LIFETIME) : 30 * 60

const supportedEvents = {
  'OnBattleStart': OnBattleStart,
  'OnBattleResult': OnBattleResult,
  'OnShot': OnShot
}

async function processEvent(eventName: string, event: Event) {
  if (eventName in supportedEvents) {
    const token = event.token
    const secret = Bun.env.JWT_SECRET
    try {
      const data = await verify(token, secret)
      supportedEvents[eventName as keyof typeof supportedEvents](data, event as any)
    } catch (e) {
      debug(`JWT error: ${e}`)
    }
  } else {
    debug(`Unsupported event: ${eventName}`)
  }
}

router.post('/OnBattleStart', async c => {
  const body = await c.req.json()

  if (!onBattleStartSchema(body)) {
    console.debug(onBattleStartSchema.errors);
    return c.json(Bun.env.DEBUG ? onBattleStartSchema.errors : '', 400)
  }

  const cacheKey = `${body.playerWotID}-${body.arenaID}`

  const replay = await redis.get(cacheKey)
  if (replay) {
    return c.text(replay)
  } else {
    const id = uuid();
    const token = await sign(id, process.env.JWT_SECRET as string);
    await redis.setEx(cacheKey, lifetime, token)
    OnBattleStart(id, body)
    return c.text(token)
  }
})


function isEventBody(body: BodyData): body is BodyData & {
  events: Event[]
} {
  return 'events' in body &&
    Array.isArray(body.events) &&
    body.events.length > 0 &&
    body.events.every(event => {
      return typeof event === 'object' &&
        'eventName' in event &&
        'token' in event &&
        typeof event.token === 'string'
    })
}

router.post('/send', async c => {
  const body = await c.req.json()
  try {
    if (isEventBody(body)) {
      for (const event of body.events) {
        await processEvent(event.eventName, event)
      }
    }
  }
  catch (e: any) {
    console.error(`Send Event error: ${e.message}`);
  }
  finally {
    return c.text('')
  }
})

export default router

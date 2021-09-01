
import config from 'config'
import Router from 'express'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Redis from 'redis'

import OnBattleStart from './eventProcessors/OnBattleStart.js'
import OnShot from './eventProcessors/OnShot.js'
import OnBattleResult from './eventProcessors/OnBattleResult.js'

const redis = Redis.createClient();

const router = Router()


const jwtSecret = config.get('battleSecretKey')

const supportedEvents = {
    OnShot,
    OnBattleResult
}


function processEvent(eventName, event) {
    if (supportedEvents[eventName]) {
        const token = event.Token
        jwt.verify(token, jwtSecret, (err, uuid) => {
            if (!err) {
                supportedEvents[eventName](uuid, event)
            }
        });
    }
}


router.post('/OnBattleStart', async (req, res) => {
    const cacheKey = `${req.body.PlayerBDID}-${req.body.ArenaID}`
    redis.get(cacheKey, (err, replay) => {
        if (replay) {
            return res.send(replay).end()
        } else {
            const id = uuidv4();
            const token = jwt.sign(id, jwtSecret);
            redis.set(cacheKey, token, 'EX', config.get('redis').startBattleTokenLifetime)

            OnBattleStart(id, req.body)

            return res.send(token).end()
        }

    })
})

router.post('/send', async (req, res) => {
    try {
        req.body.events.forEach(async event => {
            processEvent(event.EventName, event)
        });
    }
    catch (e) {
        console.error(`Send Event error: ${e.message}`);
    }
    finally {
        return res.status(200).end()
    }
})


export default router
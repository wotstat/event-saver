
import config from 'config'
import Router from 'express'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';


import OnBattleStart from './eventProcessors/OnBattleStart.js'
import OnShot from './eventProcessors/OnShot.js'
import OnBattleResult from './eventProcessors/OnBattleResult.js'

const router = Router()

const jwtSecret = config.get('battle-secret-key')

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

function startBattleEvent(event) {
    const id = uuidv4();
    OnBattleStart(id, event)
    return jwt.sign(id, jwtSecret)
}


router.post('/send', async (req, res) => {
    try {
        req.body.events.forEach(async event => {

            if (event.EventName == 'OnBattleStart') {
                res.send(startBattleEvent(event))
            } else {
                processEvent(event.EventName, event)
            }
        });
    }
    catch (e) {
        console.error(`send route error: ${e.message}`);
    }
    finally {
        return res.status(200).end()
    }
})


export default router
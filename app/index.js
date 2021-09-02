import express from 'express'
import cors from 'cors'
import config from 'config'

import sendRoute from './event/send/index.js'
import status from './status/index.js'

const app = express()

app.use(express.json())
app.use(cors());
app.options('*', cors());

app.use('/api/events', sendRoute)
app.use('/api/events', status)

async function Start() {
    const port = config.get('appPort') || 5000
    try {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}/api/events`)
        })
    }
    catch (e) {
        console.error(`Server error: ${e.message}`)
        process.exit(1)
    }
}

Start()
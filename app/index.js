const express = require('express')
const cors = require('cors')
const config = require('config')

const app = express()

app.use(express.json())
app.use(cors());
app.options('*', cors());

app.use('/api/event', require('./event/send'))

async function Start() {
    const port = config.get('app-port') || 5000
    try {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        })
    }
    catch (e) {
        console.error(`Server error: ${e.message}`)
        process.exit(1)
    }
}

Start()
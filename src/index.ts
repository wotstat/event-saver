import express from 'express'
import cors from 'cors'

import routes from './routes/index.js'
import { migrate } from './db/migration.js'
import { connect, clickhouse } from './db/index.js'
import { redis } from './redis/index.js'


const app = express();

app.use(express.json())
app.use(cors());
app.options('*', cors());

app.use('/', routes)

async function Start() {
  const port = process.env.PORT;

  try {
    if (!await connect({ timeout: 10 })) {
      throw new Error('ClickHouse is not available')
    }

    await Promise.all([
      migrate(clickhouse),
      redis.connect()
    ])

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    })
  }
  catch (e: any) {
    console.error(`Server error: ${e.message}`)
    process.exit(1)
  }
}

Start()


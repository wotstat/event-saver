import config from 'config'
import clickHouse from 'clickhouse'
import { Migrate } from './migration/index.js';

const clickhouse = new clickHouse.ClickHouse(config.get('clickHouse'))

Migrate(clickhouse).then(() => {
    console.log('Done');
})
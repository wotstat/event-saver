import config from 'config'
import clickHouse from 'clickhouse'
import { Rollback } from './migration/index.js';

const clickhouse = new clickHouse.ClickHouse(config.get('clickHouse'))

Rollback(clickhouse)
    .then(() => {
        console.log('Done');
    })
    .catch(error => {
        console.error(error);
    })

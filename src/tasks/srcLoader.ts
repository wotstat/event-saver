
import { schedule } from "node-cron";
import { load } from './srcLoader/index';

export function start() {
  load()
  schedule('0 4 * * *', async () => {
    load()
  });
}

import { insert } from "../insert.js"
import { now, secToMs, unwrapDynamicBattleInfo, unwrapVector3 } from './utils.js';

import { OnBattleStart } from '@/types/events.js';


export default function process(battleUUID: string, e: OnBattleStart) {
  insert('Event_OnBattleStart', {
    id: battleUUID,
    dateTime: now(),
    arenaId: e.arenaID,
    playerWotId: e.playerWotID,
    modVersion: e.modVersion,
    loadBattlePeriod: e.battlePeriod,
    inQueueWaitTime: secToMs(e.inQueueWaitTime),
    loadTime: secToMs(e.loadTime),
    preBattleWaitTime: secToMs(e.preBattleWaitTime),
    gameplayMask: e.gameplayMask,
    ...unwrapVector3('spawnPoint', e.spawnPoint),
    ...unwrapDynamicBattleInfo(e)
  })
}

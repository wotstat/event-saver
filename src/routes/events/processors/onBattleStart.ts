import { insert } from "../insert.js"
import { now, unwrapDynamicBattleInfo, unwrapVector3 } from './utils.js';

import { OnBattleStart } from '@/types/events.js';


export default function process(battleUUID: string, e: OnBattleStart) {
  insert('Event_OnBattleStart', {
    id: battleUUID,
    dateTime: now(),
    battleTime: e.battleTime,
    arenaId: e.arenaID,
    playerWotId: e.playerWotID,
    modVersion: e.modVersion,
    loadBattlePeriod: e.battlePeriod,
    inQueueWaitTime: e.inQueueWaitTime,
    loadTime: e.loadTime,
    preBattleWaitTime: e.preBattleWaitTime,
    gameplayMask: e.gameplayMask,
    ...unwrapVector3('spawnPoint', e.spawnPoint),
    ...unwrapDynamicBattleInfo(e)
  })
}

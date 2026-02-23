import { insert } from '../insert'
import { now, secToMs, unwrapDynamicBattleInfo, unwrapEvent, unwrapServerInfo, unwrapSessionMeta, unwrapVector3 } from './utils'

import { type OnBattleStart } from '@/types/events'


export default function process(battleUUID: string, e: OnBattleStart) {
  insert('Event_OnBattleStart', {
    id: battleUUID,
    dateTime: now(),
    arenaId: e.arenaID,
    loadBattlePeriod: e.battlePeriod,
    inQueueWaitTime: Math.max(0, secToMs(e.inQueueWaitTime)),
    loadTime: secToMs(e.loadTime),
    preBattleWaitTime: secToMs(e.preBattleWaitTime),
    gameplayMask: e.gameplayMask,
    battleTime: secToMs(e.battleTime),
    ...unwrapVector3('spawnPoint', e.spawnPoint),
    ...unwrapDynamicBattleInfo(e),
    ...unwrapSessionMeta(e),
    ...unwrapEvent(e),
    ...unwrapServerInfo(e),
  }, e)
}

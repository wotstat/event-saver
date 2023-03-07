import { insert } from "../insert.js"
import { now, unwrapVector3 } from './utils.js';

import { OnBattleStart } from '@/types/events.js';


export default function process(battleUUID: string, e: OnBattleStart) {
  insert('Event_OnBattleStart', {
    id: battleUUID,
    dateTime: now(),
    battleTime: e.battleTime,
    arenaId: e.arenaID,
    arenaTag: e.arenaTag,
    battleGameplay: e.battleGameplay,
    gameplayMask: e.gameplayMask,
    battleMode: e.battleMode,
    loadBattlePeriod: e.battlePeriod,
    gameVersion: e.gameVersion,
    modVersion: e.modVersion,
    playerName: e.playerName,
    playerWotId: e.playerWotID,
    inQueueWaitTime: e.inQueueWaitTime,
    loadTime: e.loadTime,
    preBattleWaitTime: e.preBattleWaitTime,
    region: e.region,
    serverName: e.serverName,
    gunTag: e.gunTag,
    tankTag: e.tankTag,
    tankType: e.tankType,
    tankLevel: e.tankLevel,
    team: e.team,
    ...unwrapVector3('spawnPoint', e.spawnPoint)
  })
}

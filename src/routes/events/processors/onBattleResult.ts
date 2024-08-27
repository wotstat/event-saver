import type { OnBattleResult } from "@/types/events";
import { insert } from "../insert"
import { now, unwrapDynamicBattleInfo, unwrapEvent, unwrapSessionMeta } from './utils';

import { check, onBattleResultSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";

function unwrapVehicleBattleResult(prefix: string, res: OnBattleResult['result']['personal']) {
  return {
    [`${prefix}.playerRank`]: 0,
    ...Object.fromEntries(Object.entries(res).map(([k, v]) => [`${prefix}.${k}`, v]))
  }
}

function unwrapPlayersResults(results: OnBattleResult['result']['playersResults']) {
  const temp = results
    .map(r => ({
      ...unwrapVehicleBattleResult('playersResults', r),
      'playersResults.bdid': r.bdid,
      'playersResults.name': r.name,
    })) as Record<string, any>[]

  const res = Object.fromEntries(Object.entries(temp[0]).map(([k, v]) => [k, temp.map(r => r[k])]))
  return res
}

export default function process(battleUUID: string, e: any) {
  check(onBattleResultSchema, e, async (e) => {
    const r = e.result

    insert('Event_OnBattleResult', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      result: r.result,
      credits: r.credits,
      originalCredits: r.originalCredits,
      duration: r.duration,
      teamHealth: r.teamHealth,
      winnerTeam: r.winnerTeam,
      playerTeam: r.playerTeam,
      arenaId: r.arenaID,
      ...unwrapVehicleBattleResult('personal', r.personal),
      ...unwrapPlayersResults(r.playersResults),
      ...unwrapDynamicBattleInfo(e),
      ...unwrapSessionMeta(e),
      ...unwrapEvent(e),
    }, e)
  })
}

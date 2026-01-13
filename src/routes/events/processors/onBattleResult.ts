import type { OnBattleResult } from "@/types/events";
import { insert } from "../insert"
import { now, unwrapDynamicBattleInfo, unwrapEvent, unwrapServerInfo, unwrapSessionMeta } from './utils';

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

function finishReason(res: OnBattleResult['result']['finishReason']) {
  if (!res) return 'unknown'
  return res.toLowerCase().split('_').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')
}


function unwrapCurrencies(prefix: string, currencies: OnBattleResult['result']['currencies'] | undefined) {
  const values = {
    originalCredits: 0,
    originalCrystal: 0,
    subtotalCredits: 0,
    autoRepairCost: 0,
    autoLoadCredits: 0,
    autoLoadGold: 0,
    autoEquipCredits: 0,
    autoEquipGold: 0,
    autoEquipCrystals: 0,
    piggyBank: 0,
    ...currencies
  }

  return Object.fromEntries(Object.entries(values).map(([k, v]) => [`${prefix}.${k}`, v]))
}

function unwrapComp7(prefix: string, comp7: OnBattleResult['result']['comp7'] | undefined) {
  const values = {
    ratingDelta: 0,
    rating: 0,
    qualBattleIndex: 0,
    qualActive: false,
    ...comp7
  }

  return Object.fromEntries(Object.entries(values).map(([k, v]) => [`${prefix}.${k}`, v]))
}

export default function process(battleUUID: string, e: any) {
  check(onBattleResultSchema, e, async (e) => {
    const r = e.result

    const currencies = unwrapCurrencies('currencies', r.currencies);

    if (!r.currencies) {
      currencies['currencies.originalCredits'] = r.originalCredits ?? 0;
    }

    insert('Event_OnBattleResult', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      result: r.result,
      finishReason: finishReason(r.finishReason),
      credits: r.credits ?? 0,
      originalCredits: r.originalCredits ?? 0,
      duration: r.duration,
      teamHealth: r.teamHealth,
      winnerTeam: r.winnerTeam,
      playerTeam: r.playerTeam,
      arenaId: r.arenaID,
      ...currencies,
      ...unwrapComp7('comp7', r.comp7),
      ...unwrapVehicleBattleResult('personal', r.personal),
      ...unwrapPlayersResults(r.playersResults),
      ...unwrapDynamicBattleInfo(e),
      ...unwrapSessionMeta(e),
      ...unwrapEvent(e),
      ...unwrapServerInfo(e),
    }, e)
  })
}

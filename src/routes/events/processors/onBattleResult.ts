import type { OnBattleResult } from '@/types/events'
import { insertNow } from '../insert'
import { now, prefixObjectKeys, snakeCaseToCamelCase, unwrapDynamicBattleInfo, unwrapEvent, unwrapPlayerInfo, unwrapServerInfo, unwrapSessionMeta } from './utils'

import { isValidEvent, onBattleResultSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'
import { redis } from '@/redis/index'
import { logger } from '@/logger'

function unwrapVehicleBattleResult(prefix: string, res: OnBattleResult['result']['personal']) {
  const { comp7SkillTag, comp7Rank, ...values } = res
  return {
    ...prefixObjectKeys(prefix, values),
    [`${prefix}.comp7SkillTag`]: comp7SkillTag ?? '',
    [`${prefix}.comp7Rank`]: comp7Rank ?? '',
  }
}

function unwrapPlayersResults(results: OnBattleResult['result']['playersResults']) {
  const temp = results.map(r => unwrapVehicleBattleResult('playersResults', r))
  return Object.fromEntries(Object.entries(temp[0]).map(([k]) => [k, temp.map(r => r[k])]))
}

function unwrapPersonalMissions(result: OnBattleResult['result']) {

  const personalMissions = result.personalMissions.map(pm => ({
    tag: pm.tag,
    conditions: pm.conditions.map(c => ({
      tag: c.tag,
      state: snakeCaseToCamelCase(c.state),
      value: c.value == null ? null : Math.floor(c.value),
      goal: c.goal == null ? null : Math.floor(c.goal),
      battles: c.battles ?? []
    }))
  }))

  return {
    personalMissions,
    personalMissionsRaw: result.personalMissionsRaw
  }
}

const DEDUPLICATION_KEY_TTL = 60 * 60 // 1 hours
export default async function process(battleUUID: string, e: unknown) {
  if (!isValidEvent(onBattleResultSchema, e)) return

  const r = e.result

  const battleEvent = {
    id: uuid(),
    onBattleStartId: battleUUID,
    dateTime: now(),
    result: r.result,
    finishReason: snakeCaseToCamelCase(r.finishReason),
    isPremium: r.isPremium,
    duration: r.duration,
    teamHealth: r.teamHealth,
    winnerTeam: r.winnerTeam,
    playerTeam: r.playerTeam,
    arenaId: r.arenaID,
    fortClanDBIDs: r.fortClanDBIDs,
    ...prefixObjectKeys('currencies', r.currencies),
    ...unwrapPersonalMissions(r),
    ...prefixObjectKeys('comp7', r.comp7),
    ...unwrapVehicleBattleResult('personal', r.personal),
    ...unwrapPlayersResults(r.playersResults),
    ...unwrapDynamicBattleInfo(e),
    ...unwrapPlayerInfo(e),
    ...unwrapSessionMeta(e),
    ...unwrapEvent(e),
    ...unwrapServerInfo(e),
  }

  insertNow('Event_OnBattleResult', battleEvent)

  const deduplicationKey = `deduplication:OnBattleResult:${e.result.arenaID}`
  try {
    const existing = await redis.exists(deduplicationKey)
    if (!existing) {
      await redis.setex(deduplicationKey, DEDUPLICATION_KEY_TTL, '1')
      insertNow('DeduplicatedBattleResults', battleEvent)
    }
  } catch (error) {
    logger.error({ error, battleUUID, deduplicationKey }, 'Failed to deduplicate OnBattleResult in Redis')
  }
}

import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import type { OnBattleResult, OnBattleStart, OnShot, OnLootboxOpen, OnMoeInfo, OnComp7Info, OnAccountStats } from './events'
import types from './types.json' with { type: 'json' }
import { logger } from '@/logger'

export const ajv = addFormats(new Ajv())

export function isValidEvent<T>(schema: ValidateFunction<T>, data: unknown): data is T {
  if (schema(data)) {
    return true
  } else {
    logger.warn({ errors: schema.errors, data: JSON.stringify(data) }, 'Validation failed for event data')
    return false
  }
}

export const onBattleResultSchema = ajv.compile<OnBattleResult>(types.definitions.OnBattleResult)
export const onBattleStartSchema = ajv.compile<OnBattleStart>(types.definitions.OnBattleStart)
export const onShotSchema = ajv.compile<OnShot>(types.definitions.OnShot)
export const onLootboxOpenSchema = ajv.compile<OnLootboxOpen>(types.definitions.OnLootboxOpen)
export const onMoeInfoSchema = ajv.compile<OnMoeInfo>(types.definitions.OnMoeInfo)
export const onComp7InfoSchema = ajv.compile<OnComp7Info>(types.definitions.OnComp7Info)
export const onAccountStatsSchema = ajv.compile<OnAccountStats>(types.definitions.OnAccountStats)


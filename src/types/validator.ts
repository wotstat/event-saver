import _Ajv, { type ValidateFunction } from "ajv"
import type { OnBattleResult, OnBattleStart, OnShot, OnLootboxOpen, MoeInfo } from "./events";
import types from './types.json' assert { type: "json" };

export const Ajv = _Ajv as unknown as typeof _Ajv;

export const ajv = new Ajv()

export function check<T>(schema: ValidateFunction<T>, data: any, t: (e: T) => void) {
  if (schema(data)) {
    t(data)
  } else {
    console.debug(schema.errors);
    console.debug(JSON.stringify(data));
  }
}

export const onBattleResultSchema = ajv.compile<OnBattleResult>(types.definitions.OnBattleResult)
export const onBattleStartSchema = ajv.compile<OnBattleStart>(types.definitions.OnBattleStart)
export const onShotSchema = ajv.compile<OnShot>(types.definitions.OnShot)
export const onLootboxOpenSchema = ajv.compile<OnLootboxOpen>(types.definitions.OnLootboxOpen)
export const moeInfoSchema = ajv.compile<MoeInfo>(types.definitions.MoeInfo)


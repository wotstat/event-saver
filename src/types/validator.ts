import _Ajv, { ValidateFunction } from "ajv"
import { OnBattleResult, OnBattleStart, OnShot } from "./events.js";
import types from './types.json' assert { type: "json" };

export const Ajv = _Ajv as unknown as typeof _Ajv.default;

export const ajv = new Ajv()

export function check<T>(schema: ValidateFunction<T>, data: any, t: (e: T) => void) {
  if (schema(data)) {
    t(data)
  } else {
    console.debug(schema.errors);
  }
}

export const onBattleResultSchema = ajv.compile<OnBattleResult>(types.definitions.OnBattleResult)
export const onBattleStartSchema = ajv.compile<OnBattleStart>(types.definitions.OnBattleStart)
export const onShotSchema = ajv.compile<OnShot>(types.definitions.OnShot)


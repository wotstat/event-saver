import { insert } from "../insert.js"
import { now } from './utils.js';

import { check, onBattleResultSchema } from '@/types/validator.js';
import { uuid } from "@/utils/uuid.js";


export default function process(battleUUID: string, e: any) {
  check(onBattleResultSchema, e, (e) => {
    insert('Event_OnBattleResult', {
      id: uuid(),
      onBattleStartId: battleUUID,
      dateTime: now(),
      reason: 'normal',
      durationMs: e.duration,
      credits: e.credits,
      xp: e.xp,
      botsCount: e.botsCount,
      result: e.result,
    })
  })
}

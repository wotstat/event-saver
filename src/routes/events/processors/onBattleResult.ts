import { insert } from "../insert"
import { now } from './utils';

import { check, onBattleResultSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";


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

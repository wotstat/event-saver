import { OnBattleResult } from '@/types/events.js';
import { v4 as uuidv4 } from 'uuid';
import { insert } from "../insert.js"
import { now } from './utils.js';

import types from '@/types/types.json' assert { type: "json" };
import { Ajv } from '@/types/validator.js';

const schema = (new Ajv()).compile<OnBattleResult>(types.definitions.OnBattleResult)

export default function process(battleUUID: string, e: any) {
  if (schema(e)) {
    insert('Event_OnBattleResult', {
      id: uuidv4(),
      onBattleStart_id: battleUUID,
      dateTime: now(),
      reason: 'normal',
      durationMs: e.duration,
      credits: e.credits,
      xp: e.xp,
      botsCount: e.botsCount,
      result: e.result,
    })
  } else {
    console.debug(schema.errors);
  }
}

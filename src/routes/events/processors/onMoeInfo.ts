import { insert } from "../insert"
import { now, unwrapEvent, unwrapHangarEvent } from './utils';

import { check, onMoeInfoSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";


export default function process(e: any) {

  check(onMoeInfoSchema, e, async (e) => {
    const [p0, p20, p40, p55, p65, p75, p85, p95, p100] = e.moeDistribution;

    insert('Event_OnMoeInfo', {
      id: uuid(),
      dateTime: now(),

      vehicleTag: e.tankTag,
      battleCount: e.battleCount,

      p0: p0,
      p20: p20,
      p40: p40,
      p55: p55,
      p65: p65,
      p75: p75,
      p85: p85,
      p95: p95,
      p100: p100,

      ...unwrapHangarEvent(e),
      ...unwrapEvent(e),
    }, e)
  })
}

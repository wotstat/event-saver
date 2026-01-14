import { insert } from "../insert"
import { now, unwrapEvent, unwrapHangarEvent } from './utils';

import { check, onComp7InfoSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";


export default function process(e: any) {

  check(onComp7InfoSchema, e, async (e) => {
    insert('Event_OnComp7Info', {
      id: uuid(),
      dateTime: now(),

      season: e.season,
      rating: e.rating,
      eliteRating: e.eliteRating,

      ...unwrapHangarEvent(e),
      ...unwrapEvent(e),
    }, e)
  })
}

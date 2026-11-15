import { insertNow } from '../insert'
import { now, unwrapHangarEvent } from './utils'

import { isValidEvent, onComp7InfoSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'


export default function process(e: unknown) {

  if (!isValidEvent(onComp7InfoSchema, e)) return

  insertNow('Event_OnComp7Info', {
    id: uuid(),
    dateTime: now(),

    season: e.season,
    rating: e.rating,
    rank: e.rank,
    leaderboardPosition: e.leaderboardPosition,

    ...unwrapHangarEvent(e),
  })
}

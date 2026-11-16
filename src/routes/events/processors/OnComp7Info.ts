import { insertNow } from '../insert'
import { now, unwrapHangarEvent } from './utils'

import { isValidEvent, onComp7InfoSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'


export default function process(e: unknown) {

  // TODO: Убрать после перехода клиентов на новый формат с rank.
  if (typeof e === 'object' && e !== null && 'eliteRating' in e && !('rank' in e)) return

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

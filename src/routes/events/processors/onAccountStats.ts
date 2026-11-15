import { insertNow } from '../insert'
import { now, unwrapHangarEvent } from './utils'

import { isValidEvent, onAccountStatsSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'


export default function process(e: unknown) {

  if (!isValidEvent(onAccountStatsSchema, e)) return

  insertNow('Event_OnAccountStats', {
    id: uuid(),
    dateTime: now(),

    credits: e.credits,
    gold: e.gold,
    crystal: e.crystal,
    equipCoin: e.equipCoin,
    bpCoin: e.bpCoin,
    eventCoin: e.eventCoin,
    piggyBankCredits: e.piggyBankCredits,
    piggyBankGold: e.piggyBankGold,
    freeXP: e.freeXP,
    isPremiumPlus: e.isPremiumPlus,
    premiumPlusExpiryTime: e.premiumPlusExpiryTime,
    isWotPlus: e.isWotPlus,
    wotPlusTier: e.wotPlusTier,
    wotPlusExpiryTime: e.wotPlusExpiryTime,
    telecom: e.telecom,

    ...unwrapHangarEvent(e),
  })
}

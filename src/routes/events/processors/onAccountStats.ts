import { insert } from '../insert'
import { now, unwrapEvent, unwrapHangarEvent } from './utils'

import { check, onAccountStatsSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'


export default function process(e: any) {

  check(onAccountStatsSchema, e, async (e) => {
    insert('Event_OnAccountStats', {
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
      wotPlusExpiryTime: e.wotPlusExpiryTime,
      telecom: e.telecom,

      ...unwrapHangarEvent(e),
      ...unwrapEvent(e),
    }, e)
  })
}

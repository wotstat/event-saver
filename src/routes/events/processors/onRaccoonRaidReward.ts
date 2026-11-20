import { isValidEvent, onRaccoonRaidRewardSchema } from '@/types/validator'
import { uuid } from '@/utils/uuid'
import { insertNow } from '../insert'
import { mapSessionMeta, secToMs, unwrapEvent, unwrapPlayerInfo, unwrapServerInfo } from './utils'

export default function process(event: unknown) {
  if (!isValidEvent(onRaccoonRaidRewardSchema, event)) return

  const { slots, parsed, startTime } = event
  const startedAt = new Date(secToMs(startTime)).toISOString()
  const ingredients = slots.map(slot => {
    const [kind, tag] = slot
    switch (kind) {
      case 'booster': {
        const [, , time, value, count] = slot
        return { kind, tag, amount: count, time, value, variant: '' }
      }
      case 'equip': {
        const [, , count, variant] = slot
        return { kind, tag, amount: count, time: 0, value: 0, variant }
      }
      default: {
        const [, , amount] = slot
        return { kind, tag, amount, time: 0, value: 0, variant: '' }
      }
    }
  })

  return insertNow('Event_OnRaccoonRaidReward', {
    id: uuid(),
    ...unwrapEvent(event),
    ...unwrapPlayerInfo(event),
    ...unwrapServerInfo(event),
    session: mapSessionMeta(event),
    startTime: startedAt.replace('T', ' ').slice(0, -1),
    durationSeconds: event.durationSeconds,
    primaryDurationSeconds: event.primaryDurationSeconds,

    'ingredients.kind': ingredients.map(ingredient => ingredient.kind),
    'ingredients.tag': ingredients.map(ingredient => ingredient.tag),
    'ingredients.amount': ingredients.map(ingredient => ingredient.amount),
    'ingredients.time': ingredients.map(ingredient => ingredient.time),
    'ingredients.value': ingredients.map(ingredient => ingredient.value),
    'ingredients.variant': ingredients.map(ingredient => ingredient.variant),

    credits: parsed.credits,
    gold: parsed.gold,
    crystal: parsed.crystal,
    freeXP: parsed.freeXP,
    xp: parsed.xp,
    tankmenXP: parsed.tankmenXP,
    eventCoin: parsed.eventCoin,
    equipCoin: parsed.equipCoin,
    bpcoin: parsed.bpcoin,
    premium: parsed.premium,
    premiumPlus: parsed.premium_plus,
    premiumVip: parsed.premium_vip,
    lootboxFragments: parsed.lootboxFragments,
    slots: parsed.slots,
    berths: parsed.berths,

    'currencies.tag': parsed.currencies?.map(([tag]) => tag),
    'currencies.amount': parsed.currencies?.map(([, amount]) => amount),

    'items.tag': parsed.items?.map(([tag]) => tag),
    'items.count': parsed.items?.map(([, count]) => count),
    'crewBooks.tag': parsed.crewBooks?.map(([tag]) => tag),
    'crewBooks.count': parsed.crewBooks?.map(([, count]) => count),
    'boosters.tag': parsed.boosters?.map(([tag]) => tag),
    'boosters.time': parsed.boosters?.map(([, time]) => time),
    'boosters.value': parsed.boosters?.map(([, , value]) => value),
    'boosters.count': parsed.boosters?.map(([, , , count]) => count),
    'equip.tag': parsed.equip?.map(([tag]) => tag),
    'equip.count': parsed.equip?.map(([, count]) => count),
    'equip.variant': parsed.equip?.map(([, , variant]) => variant),
    'discounts.tag': parsed.discounts?.map(([tag]) => tag),
    'discounts.value': parsed.discounts?.map(([, value]) => value),
    'discounts.count': parsed.discounts?.map(([, , count]) => count),

    'lootboxes.tag': parsed.lootboxesTokens?.map(([tag]) => tag),
    'lootboxes.count': parsed.lootboxesTokens?.map(([, count]) => count),
    'lootboxKeys.tag': parsed.lootboxKeys?.map(([tag]) => tag),
    'lootboxKeys.count': parsed.lootboxKeys?.map(([, count]) => count),
    'recruits.tag': parsed.recruits?.map(([tag]) => tag),
    'recruits.count': parsed.recruits?.map(([, count]) => count),
    'bonus.tag': parsed.bonusTokens?.map(([tag]) => tag),
    'bonus.count': parsed.bonusTokens?.map(([, count]) => count),
    'entitlements.tag': parsed.entitlements?.map(([tag]) => tag),
    'entitlements.count': parsed.entitlements?.map(([, count]) => count),
    'customizations.type': parsed.customizations?.map(([type]) => type),
    'customizations.tag': parsed.customizations?.map(([, tag]) => tag),
    'customizations.count': parsed.customizations?.map(([, , count]) => count),

    addedVehicles: parsed.addedVehicles,
    removedVehicles: parsed.removedVehicles,
    'rentedVehicles.tag': parsed.rentedVehicles?.map(([tag]) => tag),
    'rentedVehicles.rentType': parsed.rentedVehicles?.map(([, rentType]) => rentType),
    'rentedVehicles.rentValue': parsed.rentedVehicles?.map(([, , rentValue]) => rentValue),
    'compensatedVehicles.tag': parsed.compensatedVehicles?.map(([tag]) => tag),
    'compensatedVehicles.variant': parsed.compensatedVehicles?.map(([, variant]) => variant),
    'compensatedVehicles.amounts': parsed.compensatedVehicles?.map(([, , amounts]) => amounts),
    'compensatedItems.targetType': parsed.compensatedItems?.map(([targetType]) => targetType),
    'compensatedItems.targetTag': parsed.compensatedItems?.map(([, tag]) => tag),
    'compensatedItems.currency': parsed.compensatedItems?.map(([, , currency]) => currency),
    'compensatedItems.amount': parsed.compensatedItems?.map(([, , , amount]) => amount),

    rawString: event.raw,
  })
}

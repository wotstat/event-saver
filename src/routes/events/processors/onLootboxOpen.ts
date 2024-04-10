import { insert } from "../insert"
import { now, unwrapEvent, unwrapHangarEvent, unwrapSessionMeta, unwrapVector3 } from './utils';

import { check, onLootboxOpenSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";


export default function process(e: any) {

  check(onLootboxOpenSchema, e, async (e) => {

    let raw = {}

    try {
      raw = JSON.parse(e.raw)
    }
    catch (e) {
      console.error('Failed to parse parsed field', e)
    }

    insert('Event_OnLootboxOpen', {
      id: uuid(),
      dateTime: now(),

      containerTag: e.containerTag,
      openCount: e.openCount,
      openGroup: e.openGroup,

      credits: e.parsed.credits,
      gold: e.parsed.gold,
      freeXP: e.parsed.freeXP,
      crystal: e.parsed.crystal,
      eventCoin: e.parsed.eventCoin,
      bpcoin: e.parsed.bpcoin,
      'currencies.tag': e.parsed.currencies.map(([tag, amount]) => tag),
      'currencies.amount': e.parsed.currencies.map(([tag, amount]) => amount),

      premium: e.parsed.premium,
      premiumPlus: e.parsed.premium_plus,
      premiumVip: e.parsed.premium_vip,

      addedVehicles: e.parsed.addedVehicles,
      'rentedVehicles.tag': e.parsed.rentedVehicles.map(([tag, rentType, rentValue]) => tag),
      'rentedVehicles.rentType': e.parsed.rentedVehicles.map(([tag, rentType, rentValue]) => rentType),
      'rentedVehicles.rentValue': e.parsed.rentedVehicles.map(([tag, rentType, rentValue]) => rentValue),
      'compensatedVehicles.tag': e.parsed.compensatedVehicles?.map(([tag, variant, gold]) => tag) ?? [],
      'compensatedVehicles.variant': e.parsed.compensatedVehicles?.map(([tag, variant, gold]) => variant) ?? [],
      'compensatedVehicles.gold': e.parsed.compensatedVehicles?.map(([tag, variant, gold]) => gold) ?? [],

      slots: e.parsed.slots,
      berths: e.parsed.berths,

      'items.tag': e.parsed.items.map(([tag, count]) => tag),
      'items.count': e.parsed.items.map(([tag, count]) => count),

      'crewBooks.tag': e.parsed.crewBooks.map(([tag, count]) => tag),
      'crewBooks.count': e.parsed.crewBooks.map(([tag, count]) => count),

      'boosters.tag': e.parsed.boosters.map(([tag, time, value, count]) => tag),
      'boosters.time': e.parsed.boosters.map(([tag, time, value, count]) => time),
      'boosters.value': e.parsed.boosters.map(([tag, time, value, count]) => value),
      'boosters.count': e.parsed.boosters.map(([tag, time, value, count]) => count),

      'discounts.tag': e.parsed.discounts.map(([tag, value]) => tag),
      'discounts.value': e.parsed.discounts.map(([tag, value]) => value),

      'equip.tag': e.parsed.equip.map(([tag, count]) => tag),
      'equip.count': e.parsed.equip.map(([tag, count]) => count),

      'lootboxes.tag': e.parsed.lootboxesTokens.map(([tag, count]) => tag),
      'lootboxes.count': e.parsed.lootboxesTokens.map(([tag, count]) => count),

      'bonus.tag': e.parsed.bonusTokens.map(([tag, count]) => tag),
      'bonus.count': e.parsed.bonusTokens.map(([tag, count]) => count),

      'customizations.type': e.parsed.customizations.map(([type, tag, count]) => type),
      'customizations.tag': e.parsed.customizations.map(([type, tag, count]) => tag),
      'customizations.count': e.parsed.customizations.map(([type, tag, count]) => count),

      'blueprints.type': e.parsed.blueprints.map(([type, specification, count]) => type),
      'blueprints.specification': e.parsed.blueprints.map(([type, specification, count]) => specification),
      'blueprints.count': e.parsed.blueprints.map(([type, specification, count]) => count),

      'selectableCrewbook.tag': e.parsed.selectableCrewbook.map(([crewbookName]) => crewbookName),

      raw: raw,
      rawString: e.raw,
      ...unwrapHangarEvent(e),
      ...unwrapSessionMeta(e),
      // ...unwrapEvent(e),
      region: e.region ?? '',
      gameVersion: e.gameVersion ?? '',
      modVersion: e.modVersion ?? '1.3.1.0',
    }, e)
  })
}

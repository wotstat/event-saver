import { modVersionComparator } from "@/utils/utils";
import { insert } from "../insert"
import { now, unwrapEvent, unwrapHangarEvent, unwrapServerInfo, unwrapSessionMeta, unwrapVector3 } from './utils';

import { check, onLootboxOpenSchema } from '@/types/validator';
import { uuid } from "@/utils/uuid";
import { logger } from "@/logger";



const comparator = modVersionComparator('1.4.3.0')

export default function process(e: any) {

  check(onLootboxOpenSchema, e, async (e) => {
    if (comparator(e.modVersion) < 0) return

    let raw = {}

    try {
      raw = JSON.parse(e.raw)
    }
    catch (error) {
      logger.error({ error }, 'Failed to parse raw field')
    }

    // TODO: Remove this after 1.5.4.1
    const currenciesTag: string[] = []
    const currenciesAmount: number[] = []

    if (e.parsed.currencies) for (const [tag, amount] of e.parsed.currencies) {
      currenciesTag.push(tag)
      currenciesAmount.push(amount)
    } else {
      try {
        const parsedString = JSON.parse(e.raw) as { currencies?: Record<string, { count: number }> }
        if (parsedString.currencies) {
          for (const [tag, { count }] of Object.entries(parsedString.currencies)) {
            currenciesTag.push(tag)
            currenciesAmount.push(count)
          }
        }
      } catch (error) {
        logger.error({ error }, 'Failed to parse currencies from raw field')
      }
    }
    // ----

    insert('Event_OnLootboxOpen', {
      id: uuid(),
      dateTime: now(),

      containerTag: e.containerTag,
      openByTag: e.openByTag ?? e.containerTag,
      isOpenSuccess: e.isOpenSuccess ?? true,
      openCount: e.openCount,
      openGroup: e.openGroup,

      credits: e.parsed.credits,
      gold: e.parsed.gold,
      freeXP: e.parsed.freeXP,
      crystal: e.parsed.crystal,
      eventCoin: e.parsed.eventCoin,
      equipCoin: e.parsed.equipCoin,
      bpcoin: e.parsed.bpcoin,
      'currencies.tag': currenciesTag,
      'currencies.amount': currenciesAmount,

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

      'extra.tag': e.parsed.extraTokens?.map(([tag, count]) => tag) ?? [],
      'extra.count': e.parsed.extraTokens?.map(([tag, count]) => count) ?? [],

      'customizations.type': e.parsed.customizations.map(([type, tag, count]) => type),
      'customizations.tag': e.parsed.customizations.map(([type, tag, count]) => tag),
      'customizations.count': e.parsed.customizations.map(([type, tag, count]) => count),

      'blueprints.type': e.parsed.blueprints.map(([type, specification, count]) => type),
      'blueprints.specification': e.parsed.blueprints.map(([type, specification, count]) => specification),
      'blueprints.count': e.parsed.blueprints.map(([type, specification, count]) => count),

      'selectableCrewbook.tag': e.parsed.selectableCrewbook.map(([crewbookName]) => crewbookName),

      'toys.tag': e.parsed.toys?.map(([tag, count]) => tag) ?? [],
      'toys.count': e.parsed.toys?.map(([tag, count]) => count) ?? [],
      'compensatedToys.tag': e.parsed.compensatedToys?.map(([tag, currency, count]) => tag) ?? [],
      'compensatedToys.currency': e.parsed.compensatedToys?.map(([tag, currency, count]) => currency) ?? [],
      'compensatedToys.count': e.parsed.compensatedToys?.map(([tag, currency, count]) => count) ?? [],

      'entitlements.tag': e.parsed.entitlements?.map(([tag, count]) => tag) ?? [],
      'entitlements.count': e.parsed.entitlements?.map(([tag, count]) => count) ?? [],

      claimed: e.claimed ?? true,
      rerollCount: e.rerollCount ?? 0,
      raw: {},
      rawString: e.raw,
      ...unwrapHangarEvent(e),
      ...unwrapSessionMeta(e),
      ...unwrapEvent(e),
      ...unwrapServerInfo(e),
    }, e)
  })
}

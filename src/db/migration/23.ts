import type { MigrationData } from "../migration";

export default {
  name: "23",
  up: `
  create materialized view if not exists lootbox_equipment_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      concat(name, ':', countV) as title,
      name as tag,
      countState() as count
  from Event_OnLootboxOpen
  array join arrayConcat(array(slots, berths), equip.count) as countV,
             arrayConcat(array('slots', 'berths'), equip.tag) as name
  where countV > 0
  group by title, tag, containerTag;
  
  

  create materialized view if not exists lootbox_crewbook_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      tag,
      concat(tag, ':', bookCount) as title,
      countState() as count
  from Event_OnLootboxOpen
  array join crewBooks.tag as tag, crewBooks.count as bookCount
  group by title, tag, containerTag;
  
  

  create materialized view if not exists lootbox_item_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      tag,
      concat(tag, ':', itemCount) as title,
      countState() as count
  from Event_OnLootboxOpen
  array join items.tag as tag, items.count as itemCount
  group by title, tag, containerTag;
  
  

  create materialized view if not exists lootbox_boosters_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      tag,
      concat(tag, ':', boosters.value, ':', boosters.time, ':', boosters.count) as title,
      countState() as count
  from Event_OnLootboxOpen
  array join boosters.tag as tag, boosters.value, boosters.time, boosters.count
  group by title, tag, containerTag;
  
  
  
  create materialized view if not exists lootbox_customizations_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      tag,
      concat(customizations.type, '|', tag, '|', customizations.count) as title,
      countState() as count
  from Event_OnLootboxOpen
  array join customizations.type, customizations.tag as tag, customizations.count
  group by title, tag, containerTag;
  
  

  create materialized view if not exists lootbox_premium_mv
  engine = AggregatingMergeTree
  order by (containerTag, title)
  populate as
  select
      containerTag,
      premiumPlus as title,
      countState() as count
  from Event_OnLootboxOpen
  where premiumPlus > 0
  group by title, containerTag;
  
  
  
  create materialized view if not exists lootbox_free_xp_mv
  engine = AggregatingMergeTree
  order by (containerTag, title)
  populate as
  select
      containerTag,
      freeXP as title,
      countState() as count
  from Event_OnLootboxOpen
  where freeXP > 0
  group by title, containerTag;
  
  
  
  create materialized view if not exists lootbox_gold_mv
  engine = AggregatingMergeTree
  order by (containerTag, title)
  populate as
  select
      containerTag,
      (gold - arraySum(compensatedVehicles.gold)) as title,
      countState() as count
  from Event_OnLootboxOpen
  where title > 0
  group by title, containerTag;
  
  
  
  create materialized view if not exists lootbox_credits_mv
  engine = AggregatingMergeTree
  order by (containerTag, title)
  populate as
  select
      containerTag,
      credits as title,
      countState() as count
  from Event_OnLootboxOpen
  where credits > 0
  group by title, containerTag;
  
  
  
  create materialized view if not exists lootbox_vehicle_mv
  engine = AggregatingMergeTree
  order by (containerTag, title)
  populate as
  select
      containerTag,
      title,
      countState() as count
  from Event_OnLootboxOpen
  array join arrayConcat(addedVehicles, compensatedVehicles.tag) as title
  group by title, containerTag;
  
  
  
  create materialized view if not exists lootbox_lootbox_mv
  engine = AggregatingMergeTree
  order by (containerTag, title, tag)
  populate as
  select
      containerTag,
      tag,
      concat(tag, ':', lootboxCount) as title,
      countState() as count
  from Event_OnLootboxOpen
  array join lootboxes.tag as tag, lootboxes.count as lootboxCount
  group by title, tag, containerTag;
  `,
  down: `
  `
} as MigrationData
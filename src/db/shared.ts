
export const battleMode = `Enum(
  'UNKNOWN',
  'REGULAR',
  'TRAINING',
  'TOURNAMENT',
  'CLAN',
  'CYBERSPORT',
  'EVENT_BATTLES',
  'GLOBAL_MAP',
  'TOURNAMENT_REGULAR',
  'TOURNAMENT_CLAN',
  'FALLOUT_CLASSIC',
  'FALLOUT_MULTITEAM',
  'SORTIE_2',
  'FORT_BATTLE_2',
  'RANKED',
  'BOOTCAMP',
  'EPIC_RANDOM',
  'EPIC_RANDOM_TRAINING',
  'EVENT_BATTLES_2',
  'EPIC_BATTLE',
  'EPIC_BATTLE_TRAINING',
  'BATTLE_ROYALE_SOLO',
  'BATTLE_ROYALE_SQUAD',
  'TOURNAMENT_EVENT',
  'BOB',
  'EVENT_RANDOM',
  'BATTLE_ROYALE_TRN_SOLO',
  'BATTLE_ROYALE_TRN_SQUAD',
  'WEEKEND_BRAWL',
  'MAPBOX',
  'MAPS_TRAINING',
  'RTS',
  'RTS_1x1',
  'RTS_BOOTCAMP',
  'FUN_RANDOM',
  'COMP7',
  'WINBACK',
  'VERSUS_AI'
)`

export const battleGameplay = `Enum(
  'ctf',
  'domination',
  'assault',
  'nations',
  'ctf2',
  'domination2',
  'assault2',
  'fallout',
  'fallout2',
  'fallout3',
  'fallout4',
  'ctf30x30',
  'domination30x30',
  'sandbox',
  'bootcamp',
  'epic',
  'maps_training',
  'rts',
  'rts_1x1',
  'rts_bootcamp',
  'comp7',
  'other'
)`


export const shellTag = `Enum(
  'HOLLOW_CHARGE',
  'HIGH_EXPLOSIVE',
  'ARMOR_PIERCING',
  'ARMOR_PIERCING_HE',
  'ARMOR_PIERCING_CR',
  'SMOKE',
  'FLAME'
)`

export const tankType = `Enum('LT', 'MT', 'HT', 'SPG', 'AT')`

export const dynamicBattleInfo = `
arenaTag                    String              comment 'Название карты',
playerName                  String              comment 'Ник игрока',
playerClan                  String              comment 'Клан игрока',
accountDBID                 UInt64              comment 'ID аккаунта',
battleMode                ${battleMode}         comment 'Тип боя',
battleGameplay            ${battleGameplay}     comment 'Режим игры',
serverName                  String              comment 'Название сервера',
region                      String              comment 'Регион',
gameVersion                 String              comment 'Версия игры',
modVersion                  String              comment 'Версия мода',
team                        UInt8               comment 'Команда',
tankTag                     String              comment 'Название танка',
tankType                  ${tankType}           comment 'Тип танка',
tankLevel                   UInt8               comment 'Уровень танка',
gunTag                      String              comment 'Тег орудия'
`
import type { Int32, UInt8, UInt16 } from './primitives'
import type { BattleExtra } from './battleExtra'
import type { Crewmate } from './crewmate'
import type { SystemInfo } from './systemInfo'

// Статические данные о бое (не изменяются), присутствуют во всех событиях для удобных селектов и фильтров
interface StaticBattleInfo {
  /** название карты */
  arenaTag: string

  /** тип боя */
  battleMode: string

  /** режим игры */
  battleGameplay: string

  /** список заблокированных карт */
  mapsBlackList: (string | null)[]

}

// Динамические данные о бое (могут изменяться во время боя), присутствуют во всех событиях для удобных селектов и фильтров
interface DynamicBattleInfo extends StaticBattleInfo, BattleExtra {

  /** команда игрока */
  team: Int32

  /** название танка */
  tankTag: string

  /** типа танка */
  tankType: string

  /** роль танка */
  tankRole: string

  /** уровень танка */
  tankLevel: Int32

  /** название пушки */
  gunTag: string,

  /** ХП союзной команды */
  allyTeamHealth: UInt8

  /** ХП вражеской команды */
  enemyTeamHealth: UInt8

  /** Максимальное ХП союзной команды */
  allyTeamMaxHealth: UInt8

  /** Максимальное ХП вражеской команды */
  enemyTeamMaxHealth: UInt8

  /** Количество фрагов союзников */
  allyTeamFragsCount: UInt8

  /** Количество фрагов врагов */
  enemyTeamFragsCount: UInt8

  /** Информация о системе */
  systemInfo: SystemInfo

  /** Тег навыка натиска */
  comp7SkillTag: string

  /** Теги снаряжения */
  equipment: (string | null)[]

  /** Теги расходников */
  consumables: (string | null)[]

  /** Теги инструкции */
  battleBooster: string

  /** Теги снарядов */
  shells: Record<string, UInt16>

  /** Информация о членах экипажа */
  crew: Crewmate[]
}

export type { DynamicBattleInfo }

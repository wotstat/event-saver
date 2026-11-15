type BOB25Stats = { [key in '1' | '2' | '3' | '4']?: { score: number, rank: number } }
type BOB25Extra = {
  allySkill: string
  enemySkill: string
  allyBloggerId: number
  enemyBloggerId: number

  personalLevel: number,

  stats: BOB25Stats
} | {
  stats: BOB25Stats
}

// Дополнительная информация внутри боя
interface BattleExtra {
  extra: {
    bob?: BOB25Extra
  }
}

export type { BattleExtra }

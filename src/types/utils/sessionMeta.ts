interface SessionMeta {
  /** Начало сессии по локальному времени клиента в ISO 8601; пустая строка, если неизвестно */
  sessionStart: string
  /** Секунд с начала сессии */
  sessionStartAgo: number
  /** сколько времени назад начался прошлый бой */
  lastBattleAgo: number
  /** Количество начатых боёв */
  battleStarts: number
  /** Количество результатов */
  battleResults: number
  /** Число побед из результатов */
  winCount: number
  /** Количество выстрелов */
  totalShots: number
  /** Количество выстрелов с уроном */
  totalShotsDamaged: number
  /** Количество попавших выстрелов */
  totalShotsHit: number

  /** Последние 10 результатов это победы */
  lastResult: ('win' | 'lose' | 'tie')[]
  /** Место в топе по урону за последние 10 результатов */
  lastDmgPlace: number[]
  /** Место в топе по опыту за последние 10 результатов */
  lastXpPlace: number[]
}

export type { SessionMeta }

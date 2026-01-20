import type { Event, DynamicBattleInfo, BattleEvent, HangarEvent, SessionMeta, ServerInfo } from "@/types/events"

export function now() {
  return (new Date()).getTime()
}

export function unwrapVector3(name: string, v: { x: number, y: number, z: number } | null) {
  if (v === null)
    return {
      [`${name}_x`]: null,
      [`${name}_y`]: null,
      [`${name}_z`]: null,
    }

  return {
    [`${name}_x`]: v.x,
    [`${name}_y`]: v.y,
    [`${name}_z`]: v.z,
  }
}

export function secToMs(sec: number) {
  return Math.round(sec * 1000)
}

export function unwrapEvent(e: Event) {
  return {
    region: e.region,
    gameVersion: e.gameVersion,
    modVersion: e.modVersion,
    localeTime: e.localtime,
  }
}

export function unwrapServerInfo(e: ServerInfo) {
  return {
    serverName: e.serverName ?? '',
    serverOnline: e.serverOnline ?? 0,
    regionOnline: e.regionOnline ?? 0,
  }
}

export function unwrapDynamicBattleInfo(e: DynamicBattleInfo) {
  return {
    arenaTag: e.arenaTag,
    playerName: e.playerName,
    playerClan: e.playerClan,
    accountDBID: e.accountDBID,
    battleMode: e.battleMode,
    battleGameplay: e.battleGameplay,
    team: e.team,
    tankTag: e.tankTag,
    tankRole: e.tankRole,
    tankType: e.tankType,
    tankLevel: e.tankLevel,
    gunTag: e.gunTag,
    allyTeamHealth: e.allyTeamHealth,
    enemyTeamHealth: e.enemyTeamHealth,
    allyTeamMaxHealth: e.allyTeamMaxHealth,
    enemyTeamMaxHealth: e.enemyTeamMaxHealth,
    allyTeamFragsCount: e.allyTeamFragsCount,
    enemyTeamFragsCount: e.enemyTeamFragsCount,
    mapsBlackList: (e.mapsBlackList ?? []).filter(Boolean),
    extra: e.extra ?? {}
  }
}

export function unwrapSessionMeta(e: Partial<SessionMeta>) {
  if (e.sessionStart === undefined) return {}

  const r = {
    battleStarts: e.battleStarts,
    battleResults: e.battleResults,
    winCount: e.winCount,
    totalShots: e.totalShots,
    totalShotsDamaged: e.totalShotsDamaged,
    totalShotsHit: e.totalShotsHit,
    lastResult: e.lastResult,
    lastDmgPlace: e.lastDmgPlace,
    lastXpPlace: e.lastXpPlace,
    startTime: e.sessionStart,
    lastBattleAgo: e.lastBattleAgo,
    startAgo: e.sessionStartAgo
  }
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [`session.${k}`, v]))
}

export function unwrapHangarEvent(e: HangarEvent) {
  return {
    playerName: e.playerName,
  }
}

export function unwrapBattleEvent(e: BattleEvent) {
  return {
    battleTime: secToMs(e.battleTime)
  }
}

export function snakeCaseToCamelCase(s: string) {
  return s.toLowerCase().split('_').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')
}
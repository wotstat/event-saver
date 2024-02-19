import type { DynamicBattleInfo, BattleEvent, SessionMeta } from "@/types/events"

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

export function unwrapDynamicBattleInfo(e: DynamicBattleInfo) {
  return {
    arenaTag: e.arenaTag,
    playerName: e.playerName,
    accountDBID: e.accountDBID,
    battleMode: e.battleMode,
    battleGameplay: e.battleGameplay,
    serverName: e.serverName,
    region: e.region,
    gameVersion: e.gameVersion,
    modVersion: e.modVersion,
    team: e.team,
    tankTag: e.tankTag,
    tankType: e.tankType,
    tankLevel: e.tankLevel,
    gunTag: e.gunTag
  }
}

export function unwrapSessionMeta(e: SessionMeta) {
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

export function unwrapBattleEvent(e: BattleEvent) {
  return {
    battleTime: secToMs(e.battleTime)
  }
}

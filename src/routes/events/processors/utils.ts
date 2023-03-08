import { DynamicBattleInfo } from "@/types/events.js"

export function now() {
  return (new Date()).getTime()
}

export function unwrapVector3(name: string, v: { x: number, y: number, z: number }) {
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
    battleMode: e.battleMode,
    battleGameplay: e.battleGameplay,
    serverName: e.serverName,
    region: e.region,
    gameVersion: e.gameVersion,
    team: e.team,
    tankTag: e.tankTag,
    tankType: e.tankType,
    tankLevel: e.tankLevel,
    gunTag: e.gunTag,
    battleTime: secToMs(e.battleTime)
  }
}

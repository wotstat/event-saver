
import { $ } from 'bun'

import { load as loadArenas } from "./arenas";
import { load as loadLootbox } from "./lootbox";
import { load as loadArtefacts } from "./artefacts";
import { load as loadCustomization } from "./customization";
import { load as loadTanks } from "./tanks";
import { parseStringPromise } from 'xml2js';

export type GameVersion = {
  full: string
  version: string
  hash: string
  comparable: number
}

async function parseGameVersion(root: string): Promise<GameVersion> {
  const versionMeta = await parseStringPromise(await Bun.file(`${root}/sources/version.xml`).text(), { explicitArray: false, trim: true })
  const version = versionMeta['version.xml'].version

  const main = version.split(' ')[0] as string
  const hash = version.split(' ')[1].replace('#', '')

  const parts = main.split('.').slice(1)
  const comp = Number.parseInt(parts.map(t => t.padStart(2, '0')).join('')) * 1e5 + Number.parseInt(hash)

  return {
    full: version,
    version: parts.join('.'),
    hash,
    comparable: comp
  }
}

const BRANCHES = ['EU', 'NA', 'RU', 'CN', 'ASIA']
const root = '/app/wot-src'

async function clone() {
  console.log('Checking git init...');
  const files = await $`ls -la . | grep .git`.text()
  const checkGitInit = files.includes('.git')
  if (checkGitInit) {
    const res = await $`git rev-parse --is-inside-work-tree`.text()
    if (res.trim() == 'true') {
      await $`git fetch && git pull --ff-only`.quiet()
      console.log('Git is init');
      return
    }
  }

  console.log('Cloning...');
  await $`git clone https://github.com/IzeBerg/wot-src.git ${root}`
}

export async function load() {
  $.cwd(root)

  await clone()
  await $`git fetch`.quiet()

  for (const branch of BRANCHES) {
    console.log(`\nCheckout to ${branch}`);

    await $`git checkout ${branch}`
    await $`git pull --ff-only`.quiet()

    const version = await parseGameVersion(root)

    await loadTanks(root, branch, version)
    await loadArenas(root, branch, version)
    await loadLootbox(root, branch, version)
    await loadArtefacts(root, branch, version)
    await loadCustomization(root, branch, version)
  }

  console.log('\nSrc loaded');

}
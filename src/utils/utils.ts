import { randomBytes } from "crypto";
import { v1 as uuidv1 } from "uuid";


export function debug(log: any) {
  if (process.env.DEBUG) {
    console.log(log)
  }
}

export function modVersionComparator(version: string) {
  const parts = version.split('.').map(Number)
  const cacheCompareResult = new Map<string, number>()

  return (v: string) => {
    if (cacheCompareResult.has(v))
      return cacheCompareResult.get(v)!

    const vParts = v.split('.').map(Number)
    let result = 0

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] > vParts[i]) {
        result = -1
        break
      }
      if (parts[i] < vParts[i]) {
        result = 1
        break
      }
    }

    cacheCompareResult.set(v, result)
    return result
  }
}

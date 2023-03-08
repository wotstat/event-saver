import { randomBytes } from "crypto";
import { v1 as uuidv1 } from "uuid";


export function debug(log: any) {
  if (process.env.DEBUG) {
    console.log(log)
  }
}

export function uuidToUInt128String(uuid: string) {
  const hex = uuid.replace(/-/g, '');
  const hi = BigInt(`0x${hex.slice(0, 16)}`).toString();
  const lo = BigInt(`0x${hex.slice(16, 32)}`).toString();
  return `${hi}${lo}`;
}

export function uuid() {
  return uuidToUInt128String(uuidv1({ node: randomBytes(6) }))
}

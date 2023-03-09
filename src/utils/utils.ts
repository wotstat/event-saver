import { randomBytes } from "crypto";
import { v1 as uuidv1 } from "uuid";


export function debug(log: any) {
  if (process.env.DEBUG) {
    console.log(log)
  }
}


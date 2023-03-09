import { randomInt } from "crypto";

let msCount = 0;
let lastTime = 0;
export function uuid() {
  const time = new Date().getTime();

  if (lastTime != time) {
    lastTime = time;
    msCount = 0;
  }

  const msOffsetStr = `${msCount++}`.padStart(5, '0');
  const randomStr = `${randomInt(1e5)}`.padStart(5, '0');

  return `${time}${msOffsetStr}${randomStr}`;
}

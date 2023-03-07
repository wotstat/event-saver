

export function debug(log: any) {
  if (process.env.DEBUG) {
    console.log(log)
  }
}

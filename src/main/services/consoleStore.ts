// src/main/services/consoleStore.ts
export type DebugEntry = any

export const consoleStore = {
  logs: [] as any,
  useAsConsole: false,
  autoClearConsoleLength: 301,
  pauseConsole: false,

  push(entry: DebugEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.autoClearConsoleLength) {
      this.logs.splice(0, this.logs.length - this.autoClearConsoleLength)
    }
  },

  clear() {
    this.logs.length = 0
  }
}

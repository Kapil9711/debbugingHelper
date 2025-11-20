import { Channels } from '../../shared/channels'
import { ConsoleEventType } from '../../shared/eventType'
import { broadcast } from '../ipc/broadcast'

// src/main/services/consoleStore.ts
export type DebugEntry = any

export const consoleStore = {
  logs: [] as any,
  useAsConsole: false,
  autoClearLength: 301,
  pauseConsole: false,
  searchString: '',

  push(entry: DebugEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.autoClearLength) {
      this.logs = this.logs.slice(-this.autoClearLength)
      broadcast(Channels.events.NetworkUpdated, {
        type: ConsoleEventType.AutoClear,
        payload: this.logs
      })
    }
  },

  clear() {
    this.logs.length = 0
  }
}

import { Channels } from '../../shared/channels'
import { NetworkEventType } from '../../shared/eventType'
import { broadcast } from '../ipc/broadcast'

export const networkStore = {
  logs: [] as any,
  autoClearLength: 301,
  pauseNetwork: false,

  push(entry: any) {
    this.logs.push(entry)
    if (this.logs.length > this.autoClearLength) {
      this.logs = this.logs.slice(-this.autoClearLength)
      broadcast(Channels.events.NetworkUpdated, {
        type: NetworkEventType.AutoClear,
        payload: this.logs
      })
    }
  },

  clear() {
    this.logs.length = 0
  }
}

import { Channels } from '../../shared/channels'
import { NetworkEventType } from '../../shared/eventType'
import { broadcast } from '../ipc/broadcast'

export const networkStore = {
  logs: [
    {
      data: { method: 'Get', url: 'https://api.testgemlay.com/customer_review' },
      type: 'networkRequest'
    },
    {
      data: {
        method: 'Post',
        url: 'https://stats2.mytuner.mobi/api/v2/web-api/play',
        body: { connect_uuid: 'a4f81ca2-b4e2-48cc-bb53-ae4386ed7dbf' }
      }
    }
  ] as any,
  autoClearLength: 301,
  pauseNetwork: false,
  searchString: '',
  selectedRequest: null,

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

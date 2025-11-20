import { ipcMain } from 'electron'
import { networkStore } from '../../services/networkStore'
import { Channels } from '../../../shared/channels'
import { broadcast } from '../broadcast'

export function registerNetworkHandlers() {
  ipcMain.handle(Channels.network.GetLogs, () => networkStore.logs)

  ipcMain.handle(Channels.network.SetPause, (_e, value: boolean) => {
    networkStore.pauseNetwork = value
    broadcast(Channels.events.NetworkUpdated, { type: 'pause', payload: value })
  })

  ipcMain.handle(Channels.network.SetAutoClearLength, (_e, value: number) => {
    networkStore.autoClearLength = value
    // networkStore.logs = networkStore.logs.slice(-networkStore.autoClearLength)
    // broadcast(Channels.events.NetworkUpdated, { type: 'autoClear', payload: networkStore.logs })
    broadcast(Channels.events.NetworkUpdated, { type: 'length', payload: value })
  })

  ipcMain.handle(Channels.network.ClearLogs, () => {
    networkStore.clear()
    broadcast(Channels.events.NetworkUpdated, { type: 'clearLog', payload: networkStore.logs })
    return true
  })
}

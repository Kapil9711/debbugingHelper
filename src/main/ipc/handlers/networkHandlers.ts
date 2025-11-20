import { ipcMain } from 'electron'
import { networkStore } from '../../services/networkStore'

export function registerNetworkHandlers() {
  ipcMain.handle('network:get-logs', () => networkStore.logs)

  ipcMain.handle('network:set-pause', (_e, value: boolean) => {
    networkStore.pauseNetwork = value
  })

  ipcMain.handle('network:set-auto-clear-length', (_e, value: number) => {
    networkStore.autoClearNetworkLength = value
  })

  ipcMain.handle('network:clear-logs', () => {
    networkStore.clear()
    return true
  })
}

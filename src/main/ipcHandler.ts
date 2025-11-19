import { ipcMain } from 'electron'

// ----- Global Shared State -----
export const state = {
  debugData: [] as any[],
  debugDataNetwork: [] as any[],
  allLogsMode: false,
  autoClearLength: 301,
  autoClearLengthNetwork: 301,
  stopConsole: false,
  stopNetwork: false
}

// ----- IPC Handlers -----
export function registerIPCHandlers() {
  ipcMain.handle('get-debug-data', () => state.debugData)

  ipcMain.handle('set-all-logs-mode', (_e, value: boolean) => {
    state.allLogsMode = value
  })

  ipcMain.handle('set-stop-console', (_e, value: boolean) => {
    state.stopConsole = value
  })

  ipcMain.handle('set-auto-clear-length', (_e, value: number) => {
    state.autoClearLength = value
  })

  ipcMain.handle('clear-debug-data', () => {
    state.debugData.length = 0
    return true
  })

  ipcMain.handle('get-debug-data-network', () => state.debugDataNetwork)

  ipcMain.handle('set-stop-network', (_e, value: boolean) => {
    state.stopNetwork = value
  })

  ipcMain.handle('set-auto-clear-length-network', (_e, value: number) => {
    state.autoClearLengthNetwork = value
  })

  ipcMain.handle('clear-debug-data-network', () => {
    state.debugDataNetwork.length = 0
    return true
  })
}

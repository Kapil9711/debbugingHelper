import { ipcMain } from 'electron'

// ----- Global Shared State -----
export const state = {
  debugData: [] as any[],
  allLogsMode: false,
  autoClearLength: 301,
  stopConsole: false
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
}

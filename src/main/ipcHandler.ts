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

  // network

  ipcMain.handle('run-request', async (_: any, req: any) => {
    console.log(req)
    try {
      const res = await fetch(req.url, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body)
      })

      const text = await res.text()
      let data

      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      console.log({
        status: res.status,
        ok: res.ok,
        data
      })

      return {
        status: res.status,
        ok: res.ok,
        data
      }
    } catch (err: any) {
      console.log(err)
      return {
        error: true,
        message: err.message
      }
    }
  })
}

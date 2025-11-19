import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('debugApi', {
      getDebugData: () => ipcRenderer.invoke('get-debug-data'),
      setAllLogsMode: (value: boolean) => ipcRenderer.invoke('set-all-logs-mode', value),
      setStopConsole: (value: boolean) => ipcRenderer.invoke('set-stop-console', value),

      setAutoClearLength: (value: number) => ipcRenderer.invoke('set-auto-clear-length', value),
      clearLogs: () => ipcRenderer.invoke('clear-debug-data')
    })
    contextBridge.exposeInMainWorld('debugApiNetwork', {
      getDebugData: () => ipcRenderer.invoke('get-debug-data-network'),
      setStopNetwork: (value: boolean) => ipcRenderer.invoke('set-stop-network', value),
      setAutoClearLength: (value: number) =>
        ipcRenderer.invoke('set-auto-clear-length-network', value),
      clearLogsNetwork: () => ipcRenderer.invoke('clear-debug-data-network'),
      testRequest: (req) => ipcRenderer.invoke('run-request', req)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

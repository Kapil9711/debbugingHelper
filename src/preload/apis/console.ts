// src/preload/apis/console.ts
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../../shared/channels'

type Unsubscribe = () => void

export const consoleApi = {
  getLogs: () => ipcRenderer.invoke(Channels.console.GetLogs) as Promise<any[]>,
  getPause: () => ipcRenderer.invoke(Channels.console.GetPause) as Promise<any[]>,
  getAutoLength: () => ipcRenderer.invoke(Channels.console.GetAutoLength) as Promise<any[]>,

  setUseAsConsole: (value: boolean) => ipcRenderer.invoke(Channels.console.SetUseAsConsole, value),
  setPause: (value: boolean) => ipcRenderer.invoke(Channels.console.SetPause, value),
  setAutoClearLength: (value: number) =>
    ipcRenderer.invoke(Channels.console.SetAutoClearLength, value),
  clearLogs: () => ipcRenderer.invoke(Channels.console.ClearLogs),

  // optional subscription API if you broadcast events from main
  onUpdated: (cb: (payload: any) => void): Unsubscribe => {
    const listener = (_: IpcRendererEvent, payload: any) => cb(payload)
    ipcRenderer.on(Channels.events.ConsoleUpdated, listener)
    return () => ipcRenderer.removeListener(Channels.events.ConsoleUpdated, listener)
  }
}

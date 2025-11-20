// src/preload/apis/network.ts
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../../shared/channels'

type Unsubscribe = () => void

export const networkApi = {
  getLogs: () => ipcRenderer.invoke(Channels.network.GetLogs) as Promise<any[]>,
  getPause: () => ipcRenderer.invoke(Channels.network.GetPause) as Promise<any[]>,
  getAutoLength: () => ipcRenderer.invoke(Channels.network.GetAutoLength) as Promise<any[]>,
  setPause: (value: boolean) => ipcRenderer.invoke(Channels.network.SetPause, value),
  setAutoClearLength: (value: number) =>
    ipcRenderer.invoke(Channels.network.SetAutoClearLength, value),
  clearLogs: () => ipcRenderer.invoke(Channels.network.ClearLogs),
  runRequest: (req: any) => ipcRenderer.invoke(Channels.network.RunRequest, req),

  onUpdated: (cb: (payload: any) => void): Unsubscribe => {
    const listener = (_: IpcRendererEvent, payload: any) => cb(payload)
    ipcRenderer.on(Channels.events.NetworkUpdated, listener)
    return () => ipcRenderer.removeListener(Channels.events.NetworkUpdated, listener)
  }
}

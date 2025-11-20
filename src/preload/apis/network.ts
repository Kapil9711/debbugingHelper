// src/preload/apis/network.ts
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../../shared/channels'

type Unsubscribe = () => void

export const networkApi = {
  getDebugData: () => ipcRenderer.invoke(Channels.network.GetLogs) as Promise<any[]>,
  setStopNetwork: (value: boolean) => ipcRenderer.invoke(Channels.network.SetPause, value),
  setAutoClearLength: (value: number) =>
    ipcRenderer.invoke(Channels.network.SetAutoClearLength, value),
  clearLogsNetwork: () => ipcRenderer.invoke(Channels.network.ClearLogs),
  runRequest: (req: any) => ipcRenderer.invoke(Channels.network.RunRequest, req),

  onUpdated: (cb: (payload: any) => void): Unsubscribe => {
    const listener = (_: IpcRendererEvent, payload: any) => cb(payload)
    ipcRenderer.on('event:network-updated', listener)
    return () => ipcRenderer.removeListener('event:network-updated', listener)
  }
}

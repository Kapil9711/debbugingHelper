import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../../shared/channels'

type Unsubscribe = () => void

export const requestApi = {
  getRequest: (query: string) => ipcRenderer.invoke(Channels.request.GetRequest, query),
  setRequest: (request: any) => ipcRenderer.invoke(Channels.request.SetRequest, request),

  deleteRequest: (query: string) => ipcRenderer.invoke(Channels.request.DeleteRequest, query),
  updateRequest: (query: string) => ipcRenderer.invoke(Channels.request.UpdateRequest, query),

  onUpdated: (cb: (payload: any) => void): Unsubscribe => {
    const listener = (_: IpcRendererEvent, payload: any) => cb(payload)
    ipcRenderer.on(Channels.events.RequestUpdated, listener)
    return () => ipcRenderer.removeListener(Channels.events.RequestUpdated, listener)
  }
}

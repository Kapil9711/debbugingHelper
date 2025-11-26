import { ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from '../../shared/channels'

type Unsubscribe = () => void

export const apiTestingApi = {
  //environment
  getEnvironments: (query: string) =>
    ipcRenderer.invoke(Channels.apiTesting.GetEnvironments, query),
  setEnvironment: (environment: any) =>
    ipcRenderer.invoke(Channels.apiTesting.SetEnvironment, environment),
  deleteEnvironment: (query: string) =>
    ipcRenderer.invoke(Channels.apiTesting.DeleteEnvironment, query),
  updateEnvironment: (data: any) => ipcRenderer.invoke(Channels.apiTesting.UpdateEnvironment, data),

  //collections
  getCollections: (query: string) => ipcRenderer.invoke(Channels.apiTesting.GetCollections, query),
  setCollection: (collection: any) =>
    ipcRenderer.invoke(Channels.apiTesting.SetCollection, collection),
  deleteCollection: (query: string) =>
    ipcRenderer.invoke(Channels.apiTesting.DeleteCollection, query),
  updateCollection: (data: any) => ipcRenderer.invoke(Channels.apiTesting.UpdateCollection, data),

  onUpdated: (cb: (payload: any) => void): Unsubscribe => {
    const listener = (_: IpcRendererEvent, payload: any) => cb(payload)
    ipcRenderer.on(Channels.events.apiTestingUpdated, listener)
    return () => ipcRenderer.removeListener(Channels.events.RequestUpdated, listener)
  }
}

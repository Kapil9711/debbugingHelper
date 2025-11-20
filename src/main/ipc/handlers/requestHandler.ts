import { ipcMain } from 'electron'
import { Channels } from '../../../shared/channels'

export function registerNetworkHandlers() {
  ipcMain.handle(Channels.request.GetRequest, (query) => {})
  ipcMain.handle(Channels.request.SetRequest, (request) => {})
  ipcMain.handle(Channels.request.DeleteRequest, (query) => {})
  ipcMain.handle(Channels.request.UpdateRequest, (query) => {})
}

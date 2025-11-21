import { ipcMain } from 'electron'
import { Channels } from '../../../shared/channels'
import { getDb } from '../../db/initMongo'

export function registorRequestHandler() {
  ipcMain.handle(Channels.request.GetRequest, async (_: any, query: any) => {
    const db = getDb()
    const RequestModel = db.collection('requests')
    const allDocs = await RequestModel.find({}).toArray()
    return allDocs
  })
  ipcMain.handle(Channels.request.SetRequest, async (_: any, request: any) => {
    const db = getDb()
    const RequestModel = db.collection('requests')

    const payload = {
      type: request?.type || '',
      url: request?.url || '',
      body: request?.body || '',
      method: request?.method || '',
      header: request?.header || {}
    }

    await RequestModel.insertOne(payload)

    // 🔥 Return full collection as array
    const allDocs = await RequestModel.find({}).toArray()

    return allDocs
  })
  ipcMain.handle(Channels.request.DeleteRequest, (query) => {})
  ipcMain.handle(Channels.request.UpdateRequest, (query) => {})
}

import { ipcMain } from 'electron'
import { Channels } from '../../../shared/channels'
import { getDb } from '../../db/initMongo'
import { broadcast } from '../broadcast'
import { RequestEventType } from '../../../shared/eventType'
import { ObjectId } from 'mongodb'

export function registorRequestHandler() {
  ipcMain.handle(Channels.request.GetRequest, async (_: any, query: any) => {
    const db = getDb()
    const RequestModel = db.collection('requests')
    const allDocs = await RequestModel.find({}).sort({ createdAt: -1 }).toArray()
    return allDocs
  })
  ipcMain.handle(Channels.request.SetRequest, async (_: any, request: any) => {
    const db = getDb()
    const RequestModel = db.collection('requests')
    // await RequestModel.deleteMany({})
    const payload = {
      type: request?.type || '',
      url: request?.url || '',
      body: request?.body || '',
      method: request?.method || '',
      headers: request?.headers || {},
      createdAt: Date.now()
    }
    const isExist = await RequestModel.findOne({ url: payload?.url, method: payload?.method })
    if (isExist) {
      await RequestModel.findOneAndUpdate(
        { url: payload?.url, method: payload?.method },
        {
          $set: {
            body: payload?.body,
            headers: payload?.headers,
            response: null,
            createdAt: Date.now()
          }
        }
      )
    } else {
      await RequestModel.insertOne(payload)
    }

    const allDocs = await RequestModel.find({})?.sort({ createdAt: -1 }).toArray()

    broadcast(Channels.events.RequestUpdated, {
      type: RequestEventType.UpdateRequest,
      payload: allDocs
    })

    return []
  })
  ipcMain.handle(Channels.request.DeleteRequest, async (_: any, query: string) => {
    const id = query
    const db = getDb()
    const RequestModel = db.collection('requests')
    const objectId = new ObjectId(id)
    await RequestModel.findOneAndDelete({ _id: objectId })
    const allDocs = await RequestModel.find({}).sort({ createdAt: -1 }).toArray()

    broadcast(Channels.events.RequestUpdated, {
      type: RequestEventType.UpdateRequest,
      payload: allDocs
    })
  })
  ipcMain.handle(Channels.request.UpdateRequest, async (_: any, data) => {
    const { id, payload } = data
    const db = getDb()
    const RequestModel = db.collection('requests')
    const objectId = new ObjectId(id)
    const exist = await RequestModel.findOne({ _id: objectId })
    const updatedDoc = {
      ...exist,
      ...payload,
      createdAt: Date.now(),
      _id: objectId
    }
    await RequestModel.replaceOne({ _id: objectId }, updatedDoc)
    const allDocs = await RequestModel.find({}).sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.RequestUpdated, {
      type: RequestEventType.UpdateRequest,
      payload: allDocs
    })
  })
}

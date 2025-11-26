import { ipcMain } from 'electron'
import { Channels } from '../../../shared/channels'
import { getDb } from '../../db/initMongo'
import { broadcast } from '../broadcast'
import { ApiTestingEventType } from '../../../shared/eventType'
import { ObjectId } from 'mongodb'

export function registorApiTestingHandler() {
  // environments
  ipcMain.handle(Channels.apiTesting.GetEnvironments, async (_: any, query: any) => {
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingEnv')
    // await ApiTestingModel.deleteMany({})
    const isGlobalExist = await ApiTestingModel.findOne({ type: 'global', title: 'Global Env' })
    const isLocalExist = await ApiTestingModel.findOne({ type: 'local', title: '' })
    if (!isGlobalExist) {
      const globalPayload = {
        type: 'global',
        title: 'Global Env',
        variables: {},
        createdAt: Date.now()
      }
      await ApiTestingModel.insertOne(globalPayload)
    }
    if (!isLocalExist) {
      const localPayload = {
        type: 'local',
        title: '',
        variables: {},
        createdAt: Date.now()
      }
      const isLocalExist = await ApiTestingModel.findOne({ type: 'local', title: '' })
      if (!isLocalExist) {
        await ApiTestingModel.insertOne(localPayload)
      }
    }
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()
    return allDocs
  })
  ipcMain.handle(Channels.apiTesting.SetEnvironment, async (_: any, environment: any) => {
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingEnv')

    if (!environment?.title) {
      return broadcast(Channels.events.apiTestingUpdated, {
        type: ApiTestingEventType.Message,
        payload: 'Title is Required'
      })
    }
    const payload = {
      type: environment?.type || 'local',
      title: environment?.title,
      variables: {},
      createdAt: Date.now()
    }

    const isExist = await ApiTestingModel.findOne({ type: payload?.type, title: payload?.title })
    if (isExist) {
      return broadcast(Channels.events.apiTestingUpdated, {
        type: ApiTestingEventType.Message,
        payload: 'Environment Already Exists'
      })
    }
    await ApiTestingModel.insertOne(payload)
    const allDocs = await ApiTestingModel.find({})?.sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateEnvironment,
      payload: allDocs
    })

    return []
  })
  ipcMain.handle(Channels.apiTesting.DeleteEnvironment, async (_: any, query: string) => {
    const id = query
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingEnv')
    const objectId = new ObjectId(id)
    await ApiTestingModel.findOneAndDelete({ _id: objectId })
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()

    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateEnvironment,
      payload: allDocs
    })
  })
  ipcMain.handle(Channels.apiTesting.UpdateEnvironment, async (_: any, data) => {
    const { id, payload } = data
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingEnv')
    const objectId = new ObjectId(id)
    const exist = await ApiTestingModel.findOne({ _id: objectId })
    const updatedDoc = {
      ...exist,
      ...payload,
      createdAt: Date.now(),
      _id: objectId
    }
    await ApiTestingModel.replaceOne({ _id: objectId }, updatedDoc)
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateEnvironment,
      payload: allDocs
    })
  })

  // collectionss
  ipcMain.handle(Channels.apiTesting.GetCollections, async (_: any, query: any) => {
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingColl')
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()
    return allDocs
  })
  ipcMain.handle(Channels.apiTesting.SetCollection, async (_: any, collection: any) => {
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingColl')
    if (!collection?.title) {
      return broadcast(Channels.events.apiTestingUpdated, {
        type: ApiTestingEventType.Message,
        payload: 'Title is Required'
      })
    }

    const payload = {
      title: collection?.title,
      docs: [],
      createdAt: Date.now()
    }
    const isExist = await ApiTestingModel.findOne({ title: payload.title })
    if (isExist) {
      return broadcast(Channels.events.apiTestingUpdated, {
        type: ApiTestingEventType.Message,
        payload: 'Collection Already Exists'
      })
    }
    await ApiTestingModel.insertOne(payload)
    const allDocs = await ApiTestingModel.find({})?.sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateCollection,
      payload: allDocs
    })

    return []
  })

  ipcMain.handle(Channels.apiTesting.DeleteCollection, async (_: any, query: string) => {
    const id = query
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingColl')
    const objectId = new ObjectId(id)
    await ApiTestingModel.findOneAndDelete({ _id: objectId })
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateCollection,
      payload: allDocs
    })
  })
  ipcMain.handle(Channels.apiTesting.UpdateCollection, async (_: any, data) => {
    const { id, payload } = data
    const db = getDb()
    const ApiTestingModel = db.collection('apiTestingColl')
    const objectId = new ObjectId(id)
    const exist = await ApiTestingModel.findOne({ _id: objectId })
    const updatedDoc = {
      ...exist,
      ...payload,
      createdAt: Date.now(),
      _id: objectId
    }
    await ApiTestingModel.replaceOne({ _id: objectId }, updatedDoc)
    const allDocs = await ApiTestingModel.find({}).sort({ createdAt: -1 }).toArray()
    broadcast(Channels.events.apiTestingUpdated, {
      type: ApiTestingEventType.UpdateCollection,
      payload: allDocs
    })
  })
}

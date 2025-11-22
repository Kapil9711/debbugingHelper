// main/db/initMongo.ts
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, Db } from 'mongodb'

let mongo: MongoMemoryServer | null = null
let client: MongoClient | null = null
let db: Db | null = null
let initPromise: Promise<Db> | null = null

export async function initMongo(): Promise<Db> {
  if (db) return db
  if (initPromise) return initPromise

  initPromise = (async () => {
    console.log('[initMongo] initializing pid:', process.pid)
    const userData = app.getPath('userData')
    const dbPath = path.join(userData, 'mongodb')
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true })

    mongo = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } })
    client = new MongoClient(mongo.getUri())
    await client.connect()
    db = client.db('debugger')

    console.log('[initMongo] done, dbPath:', dbPath, ' pid:', process.pid)
    return db
  })()

  return initPromise
}

export function getDb(): Db {
  if (!db) throw new Error('DB not initialized')
  return db
}

// Add a cleanup so reloader/quitter can stop mongo
export async function closeMongo() {
  try {
    if (client) await client.close()
    if (mongo) await mongo.stop()
  } catch (err) {
    console.warn('[closeMongo] error', err)
  } finally {
    client = null
    mongo = null
    db = null
    initPromise = null
  }
}

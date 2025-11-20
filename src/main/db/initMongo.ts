// main/db/initMongo.ts
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, Db } from 'mongodb'

let mongo: MongoMemoryServer
let client: MongoClient
let db: Db

export async function initMongo() {
  const userData = app.getPath('userData')
  const dbPath = path.join(userData, 'mongodb')
  if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true })
  mongo = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger' } })
  client = new MongoClient(mongo.getUri())
  await client.connect()
  db = client.db('debugger')
  return db
}

export function getDb(): Db {
  if (!db) throw new Error('DB not initialized')
  return db
}

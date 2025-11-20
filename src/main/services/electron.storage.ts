import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const storageBase = path.join(app.getPath('userData'), 'storage')
fs.mkdirSync(storageBase, { recursive: true })

function getFilePath(key: string): string {
  return path.join(storageBase, `${key}.json`)
}

export const Storage = {
  set<T = any>(key: string, data: T): boolean {
    try {
      fs.writeFileSync(getFilePath(key), JSON.stringify(data, null, 2), 'utf8')
      return true
    } catch (err) {
      console.error('Storage set error:', err)
      return false
    }
  },

  get<T = any>(key: string): T | null {
    try {
      const filePath = getFilePath(key)
      if (!fs.existsSync(filePath)) return null
      return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
    } catch (err) {
      console.error('Storage get error:', err)
      return null
    }
  },

  remove(key: string): boolean {
    try {
      const filePath = getFilePath(key)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      return true
    } catch (err) {
      console.error('Storage remove error:', err)
      return false
    }
  },

  clearAll(): boolean {
    try {
      fs.rmSync(storageBase, { recursive: true, force: true })
      fs.mkdirSync(storageBase, { recursive: true })
      return true
    } catch (err) {
      console.error('Storage clear error:', err)
      return false
    }
  },

  listKeys(): string[] {
    try {
      return fs.readdirSync(storageBase).map((file) => file.replace('.json', ''))
    } catch {
      return []
    }
  }
}

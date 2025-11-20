// src/main/index.ts (recommended)
import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import { createMainWindow } from './windows/createMainWindow'
import { initMongo } from './db/initMongo'
import { registerAllIpcHandlers } from './ipc'
import { startServer } from './server'

async function bootApp() {
  // Set app id etc.
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // start any background servers / register IPC, but DO NOT create BrowserWindow yet

  await initMongo()

  startServer()
  registerAllIpcHandlers()

  // create the window only after app is ready
  if (app.isReady()) {
    createMainWindow()
  } else {
    app.whenReady().then(() => {
      createMainWindow()
    })
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
}

bootApp()

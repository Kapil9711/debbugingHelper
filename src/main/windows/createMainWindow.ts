// src/main/windows/createMainWindow.ts
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'

const WINDOW_STATE_FILE = join(app.getPath('userData'), 'window-state.json')

type WindowState = {
  x?: number
  y?: number
  width?: number
  height?: number
}

function readWindowState(): WindowState | null {
  try {
    if (fs.existsSync(WINDOW_STATE_FILE)) {
      const raw = fs.readFileSync(WINDOW_STATE_FILE, 'utf8')
      return JSON.parse(raw) as WindowState
    }
  } catch (e) {
    // ignore parse errors
    // console.warn('Failed to read window state', e)
  }
  return null
}

function saveWindowState(win: BrowserWindow) {
  try {
    const bounds = win.getBounds()
    const state: WindowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    }
    fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(state))
  } catch (e) {
    // ignore write errors
    // console.warn('Failed to save window state', e)
  }
}

/**
 * Create and return the main application window.
 * Keeps behavior compatible with your existing main/index.ts usage.
 */
export function createMainWindow(): BrowserWindow {
  const prevState = readWindowState()
  const width = prevState?.width ?? 900
  const height = prevState?.height ?? 670
  const x = prevState?.x
  const y = prevState?.y

  const mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // show when ready (prevents white flash)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // in dev open devtools automatically for convenience
    if (is.dev) mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  // save bounds on close so we can restore next time
  mainWindow.on('close', () => {
    saveWindowState(mainWindow)
  })

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load dev URL or built file — keep environment key consistent with your index.ts
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

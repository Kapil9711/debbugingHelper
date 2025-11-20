// main/ipc/broadcast.ts
import { BrowserWindow } from 'electron'

export function broadcast(channel: string, payload?: any) {
  BrowserWindow.getAllWindows().forEach((win) => {
    try {
      win.webContents.send(channel, payload)
    } catch (err) {
      // ignore per-window failures
      console.warn('Broadcast send failed', err)
    }
  })
}

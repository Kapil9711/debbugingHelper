import { ipcMain } from 'electron'
import { consoleStore } from '../../services/consoleStore'

export function registerConsoleHandlers() {
  ipcMain.handle('console:get-logs', () => consoleStore.logs)

  ipcMain.handle('console:set-use-as-console', (_e, value: boolean) => {
    consoleStore.useAsConsole = value
  })

  ipcMain.handle('console:set-pause', (_e, value: boolean) => {
    consoleStore.pauseConsole = value
  })

  ipcMain.handle('console:set-auto-clear-length', (_e, value: number) => {
    consoleStore.autoClearConsoleLength = value
  })

  ipcMain.handle('console:clear-logs', () => {
    consoleStore.clear()
    return true
  })
}

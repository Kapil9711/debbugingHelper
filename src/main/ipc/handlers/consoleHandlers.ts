import { ipcMain } from 'electron'
import { consoleStore } from '../../services/consoleStore'
import { Channels } from '../../../shared/channels'

export function registerConsoleHandlers() {
  ipcMain.handle(Channels.console.GetLogs, () => consoleStore.logs)

  ipcMain.handle(Channels.console.SetUseAsConsole, (_e, value: boolean) => {
    consoleStore.useAsConsole = value
  })

  ipcMain.handle(Channels.console.SetPause, (_e, value: boolean) => {
    consoleStore.pauseConsole = value
  })

  ipcMain.handle(Channels.console.SetAutoClearLength, (_e, value: number) => {
    consoleStore.autoClearConsoleLength = value
  })

  ipcMain.handle(Channels.console.ClearLogs, () => {
    consoleStore.clear()
    return true
  })
}

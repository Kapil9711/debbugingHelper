import { ipcMain } from 'electron'
import { consoleStore } from '../../services/consoleStore'
import { Channels } from '../../../shared/channels'
import { broadcast } from '../broadcast'
import { ConsoleEventType } from '../../../shared/eventType'

export function registerConsoleHandlers() {
  ipcMain.handle(Channels.console.GetLogs, () => consoleStore.logs)
  ipcMain.handle(Channels.console.GetPause, () => consoleStore.pauseConsole)
  ipcMain.handle(Channels.console.GetAutoLength, () => consoleStore.autoClearLength)

  ipcMain.handle(Channels.console.SetUseAsConsole, (_e, value: boolean) => {
    consoleStore.useAsConsole = value
    // broadcast(Channels.events.ConsoleUpdated, { type: ConsoleEventType.Pause, payload: value })
  })

  ipcMain.handle(Channels.console.SetPause, (_e, value: boolean) => {
    consoleStore.pauseConsole = value
    broadcast(Channels.events.ConsoleUpdated, { type: ConsoleEventType.Pause, payload: value })
  })

  ipcMain.handle(Channels.console.SetAutoClearLength, (_e, value: number) => {
    consoleStore.autoClearLength = value
    broadcast(Channels.events.ConsoleUpdated, { type: ConsoleEventType.Length, payload: value })
  })

  ipcMain.handle(Channels.console.ClearLogs, () => {
    consoleStore.clear()
    broadcast(Channels.events.ConsoleUpdated, {
      type: ConsoleEventType.ClearLog,
      payload: consoleStore.logs
    })
    return true
  })
}

// ipc/index.ts

import { registerConsoleHandlers } from './handlers/consoleHandlers'
import { registerNetworkHandlers } from './handlers/networkHandlers'
import { registorRequestHandler } from './handlers/requestHandler'

// import more handlers here (settings, logs, mongo, etc.)

export function registerAllIpcHandlers() {
  registerConsoleHandlers()
  registerNetworkHandlers()
  registorRequestHandler()

  // future:
  // registerSettingsHandlers()
  // registerMongoLogHandlers()
  // registerWindowHandlers()
  // registerDebugHandlers()
}

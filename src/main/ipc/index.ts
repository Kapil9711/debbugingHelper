// ipc/index.ts

import { registerConsoleHandlers } from './handlers/consoleHandlers'
import { registerNetworkHandlers } from './handlers/networkHandlers'

// import more handlers here (settings, logs, mongo, etc.)

export function registerAllIpcHandlers() {
  registerConsoleHandlers()
  registerNetworkHandlers()

  // future:
  // registerSettingsHandlers()
  // registerMongoLogHandlers()
  // registerWindowHandlers()
  // registerDebugHandlers()
}

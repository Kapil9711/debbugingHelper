// ipc/index.ts
import { registorApiTestingHandler } from './handlers/apiTestingHandlers'
import { registerConsoleHandlers } from './handlers/consoleHandlers'
import { registerNetworkHandlers } from './handlers/networkHandlers'
import { registorRequestHandler } from './handlers/requestHandler'

// import more handlers here (settings, logs, mongo, etc.)
export function registerAllIpcHandlers() {
  registerConsoleHandlers()
  registerNetworkHandlers()
  registorRequestHandler()
  registorApiTestingHandler()
}

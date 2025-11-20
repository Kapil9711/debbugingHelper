// src/shared/channels.ts
export const Channels = {
  console: {
    GetLogs: 'console:get-logs',
    SetUseAsConsole: 'console:set-use-as-console',
    SetPause: 'console:set-pause',
    SetAutoClearLength: 'console:set-auto-clear-length',
    ClearLogs: 'console:clear-logs',
    GetPause: 'console:get-pause',
    GetAutoLength: 'console:get-auto-length',
    GetSearchString: 'console:get-search-string',
    SetSearchString: 'console:set-search-string'
  },
  network: {
    GetLogs: 'network:get-logs',
    GetSearchString: 'network:get-search-string',
    SetSearchString: 'network:set-search-string',
    GetPause: 'network:get-Pause',
    GetAutoLength: 'network:get-auto-length',
    SetPause: 'network:set-pause',
    SetAutoClearLength: 'network:set-auto-clear-length',
    ClearLogs: 'network:clear-logs',
    RunRequest: 'network:run-request'
  },
  request: {
    GetRequest: 'request:get-request',
    SetRequest: 'request:set-request',
    DeleteRequest: 'request:delete-request',
    UpdateRequest: 'request:update-request'
  },
  events: {
    ConsoleUpdated: 'event:console-updated',
    NetworkUpdated: 'event:network-updated',
    RequestUpdated: 'event:request-updated'
  }
} as const

export type Channels = typeof Channels
export type ChannelValue = Channels[keyof Channels][keyof Channels[keyof Channels]]

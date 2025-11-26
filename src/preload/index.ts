// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { consoleApi } from './apis/console'
import { networkApi } from './apis/network'
import { Channels } from '../shared/channels'
import { requestApi } from './apis/request'
import { apiTestingApi } from './apis/apiTesting'

function flattenChannelValues(obj: any): string[] {
  const out: string[] = []
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') {
      out.push(...flattenChannelValues(val))
    } else if (typeof val === 'string') {
      out.push(val)
    }
  }
  return out
}

const allowedChannels = new Set<string>(flattenChannelValues(Channels))

// low-level guarded invoke (optional utility)
const safeInvoke = (channel: string, ...args: any[]) => {
  if (!allowedChannels.has(channel)) {
    throw new Error(`Attempt to invoke forbidden IPC channel: ${channel}`)
  }
  return ipcRenderer.invoke(channel, ...args)
}

// Expose APIs safely when contextIsolation is enabled (recommended)
if (process.contextIsolated) {
  try {
    // expose toolkit-provided `electron` helpers (if you rely on them)
    contextBridge.exposeInMainWorld('electron', electronAPI)

    // grouped, feature-specific APIs
    contextBridge.exposeInMainWorld('api', {
      console: consoleApi,
      network: networkApi,
      request: requestApi,
      apiTesting: apiTestingApi,
      // low-level invoke if you need custom access (still guarded)
      invoke: safeInvoke
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('preload expose failed', error)
  }
} else {
  // fallback for non-isolated contexts (rare). Still attach same shape to window.
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = {
    console: consoleApi,
    network: networkApi,
    invoke: safeInvoke,
    request: requestApi
  }
}

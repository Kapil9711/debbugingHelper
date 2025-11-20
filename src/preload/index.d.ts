// src/preload/types.d.ts
import { ElectronAPI } from '@electron-toolkit/preload'

export type Unsubscribe = () => void

declare global {
  interface Window {
    /**
     * Provided by @electron-toolkit/preload
     * (optional if you don't use the toolkit helpers)
     */
    electron: ElectronAPI

    /**
     * New grouped API surface exposed by preload
     * Preferred: window.api.console / window.api.network
     */
    api: {
      console: {
        getLogs: () => Promise<any[]>
        getPause: () => Promise<any>
        getAutoLength: () => Promise<any>
        setUseAsConsole: (value: boolean) => Promise<void>
        setPause: (value: boolean) => Promise<void>
        setSearchString: (value: string) => Promise<void>
        getSearchString: () => Promise<string>
        setAutoClearLength: (value: number) => Promise<void>
        clearLogs: () => Promise<void>

        onUpdated?: (callback: (data: any) => void) => Unsubscribe
      }
      network: {
        getLogs: () => Promise<any[]>
        getPause: () => Promise<any>
        setSearchString: (value: string) => Promise<void>
        getSearchString: () => Promise<string>
        getAutoLength: () => Promise<any>
        runRequest: (req: any) => Promise<any>
        setPause: (value: boolean) => Promise<void>
        setAutoClearLength: (value: number) => Promise<void>
        clearLogs: () => Promise<void>
        onUpdated?: (callback: (data: any) => void) => Unsubscribe
      }
      request: {
        getRequest: (query: string) => Promise<any>
        setRequest: (request: any) => Promise<any>
        deleteRequest: (query: string) => Promise<any>
        updateRequest: (query: string) => Promise<any>
      }
      /**
       * Low-level guarded invoke (optional)
       */
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }

    /**
     * Legacy compatibility: your old names. Prefer `window.api...` going forward.
     * These can be left as-is so existing renderer code doesn't break immediately.
     */
    debugApi: {
      getDebugData: () => Promise<any>
      setAllLogsMode: (value: boolean) => Promise<void>
      setStopConsole: (value: boolean) => Promise<void>
      setAutoClearLength: (value: number) => Promise<void>
      onNewEntry?: (callback: (data: any) => void) => Unsubscribe
      clearLogs: () => Promise<any>
    }

    debugApiNetwork: {
      getLogs: () => Promise<any>
      setStopNetwork: (value: boolean) => Promise<void>
      setAutoClearLength: (value: number) => Promise<void>
      onNewEntry?: (callback: (data: any) => void) => Unsubscribe
      clearLogsNetwork: () => Promise<any>
      testRequest: (req: any) => Promise<any>
    }
  }
}

export {}

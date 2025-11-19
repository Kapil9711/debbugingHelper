import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    debugApi: {
      getDebugData: () => Promise<any>
      setAllLogsMode: (value: boolean) => Promise<void> // ← ADD THIS
      setStopConsole: (value: boolean) => Promise<void> // ← ADD THIS
      setAutoClearLength: (value: number) => Promise<void> // ← ADD THIS
      onNewEntry?: (callback: (data: any) => void) => void
      clearLogs: () => Promise<any>
    }
  }
}

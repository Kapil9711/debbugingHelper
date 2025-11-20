import { ipcMain } from 'electron'
import { networkStore } from '../../services/networkStore'
import { Channels } from '../../../shared/channels'
import { NetworkEventType } from '../../../shared/eventType'

import { broadcast } from '../broadcast'

export function registerNetworkHandlers() {
  ipcMain.handle(Channels.network.GetLogs, () => networkStore.logs)
  ipcMain.handle(Channels.network.GetPause, () => networkStore.pauseNetwork)
  ipcMain.handle(Channels.network.GetAutoLength, () => networkStore.autoClearLength)

  ipcMain.handle(Channels.network.GetSearchString, () => networkStore.searchString)
  ipcMain.handle(Channels.network.SetSearchString, (_: any, value: string) => {
    networkStore.searchString = value
    broadcast(Channels.events.NetworkUpdated, {
      type: NetworkEventType.searchString,
      payload: value
    })
  })

  ipcMain.handle(Channels.network.SetPause, (_e, value: boolean) => {
    networkStore.pauseNetwork = value
    broadcast(Channels.events.NetworkUpdated, { type: NetworkEventType.Pause, payload: value })
  })
  ipcMain.handle(Channels.network.SetAutoClearLength, (_e, value: number) => {
    networkStore.autoClearLength = value
    // networkStore.logs = networkStore.logs.slice(-networkStore.autoClearLength)
    // broadcast(Channels.events.NetworkUpdated, { type: 'autoClear', payload: networkStore.logs })
    broadcast(Channels.events.NetworkUpdated, { type: NetworkEventType.Length, payload: value })
  })

  ipcMain.handle(Channels.network.RunRequest, async (_e: any, req: any) => {
    if (!fetch) {
      return {
        ok: false,
        error: 'Fetch not available in main process. Install node-fetch or use Node >= 18.'
      }
    }

    const { url, method = 'GET', headers = {}, body, timeoutMs = 30000 } = req || {}

    if (!url) {
      return { ok: false, error: 'Missing url' }
    }

    // prepare body and headers
    let finalBody: any = null
    const finalHeaders: Record<string, string> = { ...(headers || {}) }

    if (body !== undefined && body !== null) {
      // If body is an object and content-type not set, stringify as JSON
      const isPlainObject =
        typeof body === 'object' &&
        !(body instanceof ArrayBuffer) &&
        !(body instanceof Uint8Array) &&
        !(body instanceof Blob)
      if (isPlainObject) {
        if (!finalHeaders['content-type'] && !finalHeaders['Content-Type']) {
          finalHeaders['Content-Type'] = 'application/json'
        }
        finalBody = JSON.stringify(body)
      } else {
        // string or Buffer-like
        finalBody = body
      }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const start = Date.now()
    try {
      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: finalBody,
        signal: controller.signal
      } as any)

      const durationMs = Date.now() - start
      clearTimeout(timeout)

      // collect headers into plain object
      const resHeaders: Record<string, string> = {}
      try {
        res.headers.forEach((v: string, k: string) => {
          resHeaders[k] = v
        })
      } catch (e) {
        // some fetch polyfills have different header iterators
        try {
          for (const [k, v] of (res.headers as any).entries()) {
            resHeaders[k] = v
          }
        } catch {}
      }

      // attempt to parse body as JSON, otherwise text, otherwise base64
      let parsedBody: any = null
      let bodySize = 0
      const contentType = (resHeaders['content-type'] || '').toLowerCase()

      try {
        if (contentType.includes('application/json')) {
          parsedBody = await res.json()
        } else if (
          contentType.startsWith('text/') ||
          contentType.includes('application/xml') ||
          contentType.includes('application/javascript')
        ) {
          parsedBody = await res.text()
        } else {
          // binary / unknown — return base64 string
          const buf = await res.arrayBuffer()
          bodySize = buf.byteLength
          const b = Buffer.from(buf)
          parsedBody = b.toString('base64')
        }
      } catch (err) {
        // fallback to text
        try {
          parsedBody = await res.text()
        } catch (err2) {
          parsedBody = null
        }
      }

      // return structured response for renderer
      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        url: res.url,
        headers: resHeaders,
        body: parsedBody,
        bodyIsBase64: !(
          typeof parsedBody === 'string' ||
          typeof parsedBody === 'object' ||
          parsedBody === null
        ),
        durationMs,
        bodySize
      }
    } catch (err: any) {
      clearTimeout(timeout)
      const isAbort = err && (err.name === 'AbortError' || err.type === 'aborted')
      return {
        ok: false,
        error: isAbort ? `Request timed out after ${timeoutMs}ms` : String(err?.message ?? err)
      }
    }
  })

  ipcMain.handle(Channels.network.ClearLogs, () => {
    networkStore.clear()
    broadcast(Channels.events.NetworkUpdated, {
      type: NetworkEventType.ClearLog,
      payload: networkStore.logs
    })
    return true
  })
}

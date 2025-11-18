// debugServer.ts
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { state } from '../ipcHandler'
import { debugCopy } from './helper/requestHanlder'
// import { debugCopy } from './debugCopy' // assuming this exists

export function startDebugServer() {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json({ limit: '10mb' }))

  app.post('/debugging', (req, res) => {
    const { type, payload } = req.body

    if (!payload) {
      return res.status(400).json({ error: 'Missing payload' })
    }

    debugCopy(
      () => state.stopConsole,
      () => state.autoClearLength,
      state.debugData,
      () => state.allLogsMode,
      payload,
      type
    )

    res.json({ isSuccess: true })
  })

  app.post('/network', (req: any, res: any) => {
    const { body, response, type, url, status, method, duration }: any = req.body
    const time = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    })
    if (type == 'xhr-response') {
      const payload = {
        data: { type, url, status, response: JSON.parse(response), duration },
        type: 'networkResponse',
        time: `🕒 ${time}`
      }
      state.debugData.push(payload)
    }

    if (type == 'xhr-request') {
      const payload = {
        data: { type, url, method, body: JSON.parse(body) },
        type: 'networkRequest',
        time: `🕒 ${time}`
      }
      state.debugData.push(payload)
    }
    res.json({ ok: true })
  })

  const PORT = 5600
  app.listen(PORT, () => console.log(`⚡ Debug server running at: http://localhost:${PORT}`))
}

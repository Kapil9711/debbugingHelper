import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import os from 'os'

export function startDebugServer(debugData: any, allLogsMode: any, autoClearLength: any) {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json({ limit: '10mb' }))

  // POST /debugging
  app.post('/debugging', (req: any, res: any) => {
    const { type, payload } = req.body
    if (!payload) {
      return res.status(400).json({ error: 'Missing payload' })
    }
    debugCopy(autoClearLength, debugData, allLogsMode, payload, type)
    return res.status(200).json({ isSuccess: true })
  })

  app.post('/network', (req: any, res: any) => {
    console.log(req.body, 'newtworkRequest')
    const payload = { data: req.body, type: 'newtworkRequest' }
    debugData.push(payload)
  })

  // Run server
  const PORT = 5600
  app.listen(PORT, () => {
    console.log(`⚡ Debug server running: http://localhost:${PORT}/debugging`)
  })
}

function debugCopy(
  autoClearLength: any,
  debugData: any,
  allLogsMode: any,
  obj: any,
  type?: string
) {
  // Desktop folder → dailyLogs/backend
  const desktop = path.join(os.homedir(), 'Desktop')
  const logDir = path.join(desktop, 'dailyLogs', 'backend')
  fs.mkdirSync(logDir, { recursive: true })

  if (debugData?.length >= Number(autoClearLength())) {
    debugData.length = 0
  }

  // Date for filename
  const today = new Date()
    .toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    .split('/')
    .reverse()
    .join('-')

  const logFile = path.join(logDir, `${today}.log`)

  // IST timestamp
  const time = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  })

  const dataString = JSON.stringify(obj, null, 2)

  const block = `
========================================================
🕒 ${time}${type ? ` (${type})` : ''}

${dataString}

`

  if (allLogsMode()) {
    debugData.push({ data: obj, type, time: `🕒 ${time}` })
  }
  // Avoid duplicates by checking existing block
  if (fs.existsSync(logFile)) {
    const fileContent = fs.readFileSync(logFile, 'utf8')
    if (fileContent.includes(dataString)) {
      return false
    }
  }
  if (!allLogsMode()) {
    debugData.push({ data: obj, type, time: `🕒 ${time}` })
  }

  fs.appendFileSync(logFile, block, 'utf8')

  return true
}

import fs from 'fs'
import path from 'path'
import os from 'os'

function debugCopy(
  stopConsole: any,
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
  if (!stopConsole()) {
    if (allLogsMode()) {
      debugData.push({ data: obj, type, time: `🕒 ${time}` })
    }
  }

  // Avoid duplicates by checking existing block
  if (fs.existsSync(logFile)) {
    const fileContent = fs.readFileSync(logFile, 'utf8')
    if (fileContent.includes(dataString)) {
      return false
    }
  }

  if (!stopConsole()) {
    if (!allLogsMode()) {
      debugData.push({ data: obj, type, time: `🕒 ${time}` })
    }
  }

  fs.appendFileSync(logFile, block, 'utf8')

  return true
}

export { debugCopy }

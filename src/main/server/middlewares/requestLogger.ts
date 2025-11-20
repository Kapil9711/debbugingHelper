import { Request, Response, NextFunction } from 'express'

export function createLogger() {
  return function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint()

    res.on('finish', () => {
      const durationNs = Number(process.hrtime.bigint() - start)
      const durationMs = (durationNs / 1_000_000).toFixed(2)

      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${durationMs}ms`
      }

      // Basic console output (you can replace this with file logger later)
      console.log(`[REQ]`, log)
    })

    next()
  }
}

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { errorHandler } from './middlewares/errorHandler'
import { config } from './config'
import { createLogger } from './middlewares/requestLogger'
import { apiRouter } from './routes'

export function createServer() {
  const app = express()
  app.use(helmet()) // basic security headers
  app.use(cors({ origin: config.allowedOrigins })) // tighten in prod
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('dev')) // request logging
  app.use(createLogger())

  // routes
  app.use('/', apiRouter)

  // health-check
  app.get('/health', (_req, res) => res.json({ ok: true }))

  // fallback error handler
  app.use(errorHandler)

  return app
}

export async function startServer(): Promise<import('http').Server> {
  const app = createServer()
  const server = app.listen(config.port, () => {
    console.log(`⚡ Debug server running at http://localhost:${config.port}`)
  })

  // graceful shutdown helpers
  process.on('SIGINT', () => server.close(() => process.exit(0)))
  process.on('SIGTERM', () => server.close(() => process.exit(0)))

  return server
}

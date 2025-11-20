import { Router } from 'express'
import { networkRouter } from './network'
// import { consoleRouter } from './console'

export const apiRouter = Router()

// Combine all feature routers
apiRouter.use('/network', networkRouter)
// apiRouter.use('/console', consoleRouter)
// apiRouter.use('/debugging', debuggingRouter)

import { Router } from 'express'
import { networkRouter } from './network'
import { consoleRouter } from './console'
// import { consoleRouter } from './console'

export const apiRouter = Router()

// Combine all feature routers
apiRouter.use('/network', networkRouter)
apiRouter.use('/debugging', consoleRouter)
// apiRouter.use('/debugging', debuggingRouter)

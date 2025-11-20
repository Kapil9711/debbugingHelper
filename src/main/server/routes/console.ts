import { Router } from 'express'
import { createConsole } from '../controllers/console'

export const consoleRouter = Router()

consoleRouter.post('/', async (req, res, next) => {
  try {
    const { type, payload } = req.body
    if (!payload) return res.status(400).json({ isSucess: false, msg: 'Payload is required' })
    const result = await createConsole(req.body)
    if (result.isSuccess) {
    }

    res.status(200).json({ isSuccess: true })
  } catch (error) {
    res.status(200).json({ isSuccess: false })
  }
})

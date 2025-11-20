import { Router } from 'express'
import { createNetwork } from '../controllers/network'

export const networkRouter = Router()

networkRouter.post('/', async (req, res, next) => {
  try {
    const result = await createNetwork(req.body)
    if (result.isSuccess) {
    }

    res.status(200).json({ isSuccess: true })
  } catch (error) {
    res.status(200).json({ isSuccess: false })
  }
})

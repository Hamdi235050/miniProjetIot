import express, { Application } from 'express'
import cors from 'cors'
import detectionRoutes from './routes/detectionRoutes'

export function createApp(): Application {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  // Routes
  app.use('/api', detectionRoutes)

  return app
}

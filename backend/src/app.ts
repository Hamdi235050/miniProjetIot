import express, { Application } from 'express'
import cors from 'cors'
import path from 'path'
import detectionRoutes from './routes/detectionRoutes'

export function createApp(): Application {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  const imagesPath = path.join(__dirname, '../images')
  app.use('/images', express.static(imagesPath))
  console.log(`📁 Images servies depuis: /images`)

  app.use('/api', detectionRoutes)

  return app
}

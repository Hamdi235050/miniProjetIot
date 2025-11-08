import { Router } from 'express'
import {
  detectImage,
  getLatest,
  getAllDetections,
  getDetectionByIdController,
  getStatsController,
  deleteAllDetectionsController,
} from '../controllers/detectionController'

const router = Router()

router.get('/hello', (_req, res) => {
  res.json({ message: 'Hello from IoT Backend with YOLO!' })
})

router.post('/detect', detectImage)

router.get('/detection/latest', getLatest)

router.get('/detections', getAllDetections)

router.get('/detection/:id', getDetectionByIdController)

router.get('/stats', getStatsController)

router.delete('/detections', deleteAllDetectionsController)

export default router

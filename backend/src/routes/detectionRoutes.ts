import { Router } from 'express'
import {
  detectImage,
  getLatest,
  getAllDetections,
  getDetectionByIdController,
  getStatsController,
} from '../controllers/detectionController'

const router = Router()

// Endpoint de test
router.get('/hello', (_req, res) => {
  res.json({ message: 'Hello from IoT Backend with YOLO!' })
})

// Envoyer une image pour détection
router.post('/detect', detectImage)

// Récupérer la dernière détection
router.get('/detection/latest', getLatest)

// Récupérer toutes les détections
router.get('/detections', getAllDetections)

// Récupérer une détection par ID
router.get('/detection/:id', getDetectionByIdController)

// Récupérer les statistiques
router.get('/stats', getStatsController)

export default router

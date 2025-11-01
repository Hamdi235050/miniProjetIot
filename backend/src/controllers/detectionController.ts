import { Request, Response } from 'express'
import { publishImage, getLatestDetection } from '../services/mqttService'
import {
  getLatestDetections,
  getDetectionById,
  getStats,
} from '../services/databaseService'

export async function detectImage(req: Request, res: Response): Promise<void> {
  try {
    const { image } = req.body

    if (!image) {
      res.status(400).json({ error: 'Image requise' })
      return
    }

    const timestamp = new Date().toISOString()

    await publishImage(image, timestamp)

    res.json({
      success: true,
      message: 'Image envoyée pour détection',
      timestamp,
    })
  } catch (error) {
    console.error('Erreur /api/detect:', error)
    res.status(500).json({ error: (error as Error).message })
  }
}

export function getLatest(req: Request, res: Response): void {
  const detection = getLatestDetection()

  if (detection) {
    res.json(detection)
  } else {
    res.json({
      message: 'En attente de détection...',
      count: 0,
      detections: [],
      status: 'waiting',
    })
  }
}

export async function getAllDetections(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const rows = await getLatestDetections(limit)
    res.json(rows)
  } catch (err) {
    console.error('Erreur DB:', err)
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getDetectionByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params
    const row = await getDetectionById(id)

    if (!row) {
      res.status(404).json({ message: 'Détection non trouvée' })
      return
    }

    res.json(row)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getStatsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const stats = await getStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

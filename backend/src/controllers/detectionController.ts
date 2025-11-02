import { Request, Response } from 'express'
import { publishImage, getLatestDetection } from '../services/mqttService'
import {
  getLatestDetections,
  getDetectionById,
  getStats,
} from '../services/databaseService'
import { saveImage } from '../services/imageService'

export async function detectImage(req: Request, res: Response): Promise<void> {
  try {
    const { image } = req.body

    if (!image) {
      res.status(400).json({ error: 'Image requise' })
      return
    }

    // Sauvegarder l'image dans le dossier images AVANT de la publier
    const imagePath = saveImage(image)
    if (!imagePath) {
      res.status(500).json({ error: "Erreur lors de la sauvegarde de l'image" })
      return
    }

    const timestamp = new Date().toISOString()

    // Publier l'image avec son chemin pour que YOLO puisse l'utiliser
    await publishImage(image, timestamp, imagePath)

    res.json({
      success: true,
      message: 'Image envoyée pour détection',
      timestamp,
      image_path: imagePath,
    })
  } catch (error) {
    console.error('Erreur /api/detect:', error)
    res.status(500).json({ error: (error as Error).message })
  }
}

export function getLatest(req: Request, res: Response): void {
  const detection = getLatestDetection()

  if (detection) {
    // Ajouter l'URL complète de l'image
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const detectionWithImageUrl = {
      ...detection,
      image_url: detection.image_path
        ? `${baseUrl}/images/${detection.image_path}`
        : null,
    }
    res.json(detectionWithImageUrl)
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

    // Ajouter l'URL complète de l'image à chaque détection
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const rowsWithImageUrl = rows.map((row) => ({
      ...row,
      image_url: row.image_path ? `${baseUrl}/images/${row.image_path}` : null,
    }))

    res.json(rowsWithImageUrl)
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

    // Ajouter l'URL complète de l'image
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const rowWithImageUrl = {
      ...row,
      image_url: row.image_path ? `${baseUrl}/images/${row.image_path}` : null,
    }

    res.json(rowWithImageUrl)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

export async function getStatsController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const stats = await getStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}

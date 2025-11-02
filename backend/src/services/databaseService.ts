import { getPool } from '../config/database'
import { Detection } from '../types'

export async function saveDetection(data: Detection): Promise<void> {
  const ts = data.timestamp || new Date().toISOString()
  const count = data.count || 0
  const detectionsJson = JSON.stringify(data.detections || [])
  const imagePath = data.image_path || null

  try {
    const pool = getPool()
    const insertSQL = `
      INSERT INTO detections (timestamp, count, detections, image_path)
      VALUES (?, ?, ?, ?)
    `
    await pool.query(insertSQL, [ts, count, detectionsJson, imagePath])
  } catch (err) {
    console.error(
      '   ❌ Erreur sauvegarde en base de données:',
      (err as Error).message
    )
    throw err
  }
}

export async function getLatestDetections(
  limit: number = 50
): Promise<Detection[]> {
  const pool = getPool()
  const rows = await pool.query(
    `SELECT id, timestamp, count, detections, image_path, created_at FROM detections ORDER BY created_at DESC LIMIT ?`,
    [limit]
  )

  return rows.map((row: any) => ({
    ...row,
    detections:
      typeof row.detections === 'string'
        ? JSON.parse(row.detections)
        : row.detections,
  }))
}

export async function getDetectionById(id: string): Promise<Detection | null> {
  const pool = getPool()
  const rows = await pool.query(`SELECT * FROM detections WHERE id = ?`, [id])
  const row = rows[0]

  if (!row) return null

  return {
    ...row,
    detections:
      typeof row.detections === 'string'
        ? JSON.parse(row.detections)
        : row.detections,
  }
}

export async function getStats(): Promise<any> {
  const pool = getPool()
  const rows = await pool.query(`
    SELECT 
      COUNT(*) as total_detections,
      SUM(count) as total_objects,
      AVG(count) as avg_objects_per_image
    FROM detections
  `)

  return rows[0]
}

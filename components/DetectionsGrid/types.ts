import { Theme } from '@components/theme'

export interface DetectionFromDB {
  id: number
  timestamp: string
  count: number
  detections: Array<{
    label: string
    confidence: number
    bbox: number[]
  }>
  image_path?: string | null
  image_url?: string | null
  created_at: string
}

export interface DetectionsGridProps {
  detections: DetectionFromDB[]
  theme: Theme
  isLoading?: boolean
}

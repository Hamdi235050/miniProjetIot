import { Theme } from '@components/theme'

export interface DetectionCardProps {
  detection: {
    id: number
    count: number
    image_url?: string | null
    created_at: string
    detections: Array<{
      label: string
      confidence: number
    }>
  }
  theme: Theme
}

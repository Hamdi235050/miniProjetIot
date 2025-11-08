import { Theme } from '@components/theme'

export interface Detection {
  label: string
  confidence: number
  bbox: number[]
}

export interface DetectionResultData {
  count: number
  detections: Detection[]
  annotated_image?: string
}

export interface DetectionResultProps {
  detectionResult: DetectionResultData
  theme: Theme
}

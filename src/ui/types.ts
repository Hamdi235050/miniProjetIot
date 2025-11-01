interface Detection {
  label: string
  confidence: number
  bbox: number[]
}
export interface DetectionResult {
  count: number
  detections: Detection[]
  annotated_image?: string
  timestamp: string
}

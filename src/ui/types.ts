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

export interface DetectionFromDB {
  id: number
  timestamp: string
  count: number
  detections: Detection[]
  image_path?: string | null
  image_url?: string | null
  created_at: string
}

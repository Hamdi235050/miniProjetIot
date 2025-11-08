export interface Detection {
  id?: number
  timestamp: string
  count: number
  detections: DetectionItem[]
  image_path?: string | null
  image_url?: string | null
  created_at?: string
  annotated_image?: string
  status?: string
}

export interface DetectionItem {
  class: string
  confidence: number
  bbox?: number[]
}

export interface MQTTConfig {
  broker: string
  port: number
  username: string
  password: string
  topicImages: string
  topicDetections: string
}

export interface DatabaseConfig {
  type: 'mysql' | 'sqlite'
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
}

export interface DetectionPayload {
  image: string
  timestamp: string
}

export interface StatsResponse {
  total_detections: number
  total_objects: number
  avg_objects_per_image: number
}

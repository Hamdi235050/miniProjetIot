import { DetectionFromDB, DetectionResultData } from '@/types'

export const uploadImageForDetection = async (
  imageData: string
): Promise<{
  success: boolean
  message: string
  timestamp: string
  image_path: string
}> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${BACKEND_URL}/api/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Failed to upload image: ${response.status} ${text}`)
  }

  return response.json()
}

export const getDetections = async (
  limit: number = 20
): Promise<DetectionFromDB[]> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${BACKEND_URL}/api/detections?limit=${limit}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch detections: ${response.status}`)
  }

  return response.json()
}

export const getLatestDetection = async (): Promise<DetectionResultData> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${BACKEND_URL}/api/detection/latest`)

  if (!response.ok) {
    throw new Error(`Failed to fetch latest detection: ${response.status}`)
  }

  return response.json()
}

export const deleteAllDetections = async (): Promise<{
  success: boolean
  message: string
  deleted_images: number
}> => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${BACKEND_URL}/api/detections`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete detections: ${response.status}`)
  }

  return response.json()
}

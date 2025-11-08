import { Theme } from '@components/theme'
import { DetectionFromDB } from '@/types'

export interface DetectionsGridProps {
  detections: DetectionFromDB[]
  theme: Theme
  isLoading?: boolean
}

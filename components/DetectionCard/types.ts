import { Theme } from '@components/theme'
import { DetectionFromDB } from '@/types'

export interface DetectionCardProps {
  detection: DetectionFromDB
  theme: Theme
}

import { Theme } from '@components/theme'

export interface CameraViewProps {
  selectedImage: string | null
  isCameraOpen: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  theme: Theme
  onClose: () => void
}

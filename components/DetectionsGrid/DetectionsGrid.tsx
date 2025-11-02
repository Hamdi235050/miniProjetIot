import { DetectionCard } from '@components/DetectionCard'
import React from 'react'
import { useStyles } from './styles'
import { DetectionsGridProps } from './types'

export const DetectionsGrid: React.FC<DetectionsGridProps> = ({
  detections,
  theme,
  isLoading = false,
}) => {
  const classes = useStyles({ theme })

  if (isLoading) {
    return <div className={classes.loadingText}>Chargement...</div>
  }

  return (
    <div className={classes.detectionsScrollContainer}>
      <div className={classes.detectionsGrid}>
        {detections.length === 0 ? (
          <div className={classes.noDetections}>
            Aucune détection disponible
          </div>
        ) : (
          detections.map((detection) => (
            <DetectionCard
              key={detection.id}
              detection={detection}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  )
}

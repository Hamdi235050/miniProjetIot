import React from 'react'
import { DetectionResultProps } from './types'
import { useStyles } from './styles'

export const DetectionResult: React.FC<DetectionResultProps> = ({
  detectionResult,
  theme,
}) => {
  const classes = useStyles({ theme })

  if (!detectionResult || detectionResult.count === 0) {
    return null
  }

  return (
    <div className={classes.detectionResult}>
      <h3 className={classes.detectionTitle}>
        Détections ({detectionResult.count} objet
        {detectionResult.count > 1 ? 's' : ''})
      </h3>

      <div>
        {detectionResult.detections.map((det, idx) => (
          <div key={idx} className={classes.detectionsContainer}>
            <span className={classes.detectionLabel}>{det.label}</span>
            <span className={classes.detectionConfidence}>
              {(det.confidence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {detectionResult.annotated_image && (
        <div className={classes.annotatedImageContainer}>
          <img
            src={detectionResult.annotated_image}
            alt="Détections annotées"
            className={classes.annotatedImage}
          />
        </div>
      )}
    </div>
  )
}

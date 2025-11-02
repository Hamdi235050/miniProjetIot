import { Camera } from '@components/icons'
import React from 'react'
import { useStyles } from './styles'
import { DetectionCardProps } from './types'

export const DetectionCard: React.FC<DetectionCardProps> = ({
  detection,
  theme,
}) => {
  const classes = useStyles({ theme })

  return (
    <div className={classes.detectionCard}>
      {detection.image_url ? (
        <img
          src={detection.image_url}
          alt={`Détection ${detection.id}`}
          className={classes.detectionImage}
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E'
          }}
        />
      ) : (
        <div className={classes.noImagePlaceholder}>
          <Camera width={40} height={40} />
          <span>Image non disponible</span>
        </div>
      )}
      <div className={classes.detectionInfo}>
        <div className={classes.detectionHeader}>
          <span className={classes.detectionCount}>
            {detection.count} objet{detection.count > 1 ? 's' : ''}
          </span>
          <span className={classes.detectionDate}>
            {new Date(detection.created_at).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className={classes.detectionObjects}>
          {detection.detections.slice(0, 3).map((det, idx) => (
            <span key={idx} className={classes.detectionTag}>
              {det.label}
            </span>
          ))}
          {detection.detections.length > 3 && (
            <span className={classes.detectionTag}>
              +{detection.detections.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

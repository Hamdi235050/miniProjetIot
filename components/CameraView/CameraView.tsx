import { Camera, Close } from '@components/icons'
import React from 'react'
import { useStyles } from './style'
import { CameraViewProps } from './types'

export const CameraView: React.FC<CameraViewProps> = ({
  selectedImage,
  isCameraOpen,
  videoRef,
  theme,
  onClose,
}) => {
  const classes = useStyles({ theme })

  return (
    <div
      className={classes.camera}
      style={selectedImage || isCameraOpen ? { padding: 0 } : undefined}
    >
      {selectedImage ? (
        <>
          <div
            className={classes.closeButton}
            onClick={onClose}
            role="button"
            aria-label="Annuler l'upload"
          >
            <Close width={12} height={12} />
          </div>
          <img src={selectedImage} alt="Selected" className={classes.image} />
        </>
      ) : isCameraOpen ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={classes.video}
        />
      ) : (
        <>
          <div style={{ color: theme.colors.slate_gray }}>
            <Camera width={40} height={40} />
          </div>
          <p className={classes.noImage}>Aucune image sélectionnée</p>
        </>
      )}
    </div>
  )
}

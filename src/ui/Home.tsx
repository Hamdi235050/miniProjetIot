import React, { useState, useRef, useEffect } from 'react'
import { Button, button_purpleVariant } from '@components/Button'
import { buttonLightVariant } from '@components/Button'
import { useTheme } from '@components/theme'
import { Export, Camera, Close } from '@components/icons'
import { useStyles } from './styles'
import { CameraCard } from '@components/CameraCard'
import { DetectionResult } from './types'
import { Scrolled } from '@components/Scrolled'
import { uploadImageForDetection } from './utils/backend'

export const Home = () => {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectionResult, setDetectionResult] =
    useState<DetectionResult | null>(null)
  const [isStreamingMode, setIsStreamingMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const streamIntervalRef = useRef<number | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportClick = () => {
    fileInputRef.current?.click()
  }

  const sendImageToBackend = async (imageData: string) => {
    try {
      setIsProcessing(true)

      const result = await uploadImageForDetection(imageData)
      console.log('Image envoyée avec succès:', result)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      alert("Erreur lors de l'envoi de l'image au backend")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = () => {
    if (!selectedImage) return
    sendImageToBackend(selectedImage)
  }

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      setIsCameraOpen(true)
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
          videoRef.current
            .play()
            .catch((e) => console.error('Video play error:', e))
        }
      }, 100)
    } catch (err) {
      console.error('Cannot access camera', err)
      alert("Impossible d'accéder à la caméra. Vérifiez les permissions.")
    }
  }

  const captureFrame = () => {
    if (!videoRef.current) return null
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', 0.8)
    }
    return null
  }

  const handleCapture = () => {
    const dataUrl = captureFrame()
    if (!dataUrl) return
    setSelectedImage(dataUrl)
    sendImageToBackend(dataUrl)
  }

  const startStreaming = () => {
    if (!isStreamingMode) {
      setIsStreamingMode(true)
      streamIntervalRef.current = setInterval(() => {
        const frame = captureFrame()
        if (frame) {
          sendImageToBackend(frame)
        }
      }, 3001)
      console.log('Mode streaming activé')
    }
  }

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    setIsStreamingMode(false)
    console.log('Mode streaming désactivé')
  }

  useEffect(() => {
    return () => {
      stopStreaming()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  return (
    <Scrolled ctx={{ theme }} className={classes.container}>
      <CameraCard ctx={{ theme }}>
        <div className={classes.containerCamera}>
          <div>
            <p className={classes.text}>Capture Photo</p>
            <p>Prenez une photo ou importez une image existante</p>
          </div>
          <div
            className={classes.camera}
            style={selectedImage || isCameraOpen ? { padding: 0 } : undefined}
          >
            {selectedImage ? (
              <>
                <div
                  className={classes.closeButton}
                  onClick={() => setSelectedImage(null)}
                  role="button"
                  aria-label="Annuler l'upload"
                >
                  <Close width={12} height={12} color="#fff" />
                </div>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className={classes.image}
                />
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
          <div className={classes.buttons}>
            {selectedImage ? (
              <>
                <Button
                  ctx={{ theme }}
                  onClick={handleSend}
                  label={isProcessing ? 'Traitement...' : 'Envoyer'}
                  variants={button_purpleVariant}
                >
                  <Export width={15} height={15} />
                </Button>
              </>
            ) : isCameraOpen ? (
              <>
                <Button
                  ctx={{ theme }}
                  onClick={handleCapture}
                  label="Prendre Photo"
                  variants={button_purpleVariant}
                >
                  <Camera width={15} height={15} />
                </Button>
                <Button
                  ctx={{ theme }}
                  onClick={isStreamingMode ? stopStreaming : startStreaming}
                  label={isStreamingMode ? 'Arrêter Stream' : 'Mode Temps Réel'}
                  variants={
                    isStreamingMode ? buttonLightVariant : button_purpleVariant
                  }
                >
                  <Camera width={15} height={15} />
                </Button>
              </>
            ) : (
              <Button
                ctx={{ theme }}
                onClick={handleOpenCamera}
                label="ouvrir la caméra"
                variants={button_purpleVariant}
              >
                <Camera width={15} height={15} />
              </Button>
            )}
            <Button
              ctx={{ theme }}
              onClick={handleExportClick}
              label="Import Image"
              variants={buttonLightVariant}
            >
              <Export width={16} height={16} />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        {detectionResult && detectionResult.count > 0 && (
          <div className={classes.detectionResult}>
            <h3 style={{ color: theme.colors.royal_blue }}>
              Détections ({detectionResult.count} objet
              {detectionResult.count > 1 ? 's' : ''})
            </h3>

            <div>
              {detectionResult.detections.map((det, idx) => (
                <div key={idx} className={classes.detectionsContainer}>
                  <span style={{ fontWeight: 'bold' }}>{det.label}</span>
                  <span style={{ color: theme.colors.bright_purple }}>
                    {(det.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {detectionResult.annotated_image && (
              <div>
                <img
                  src={detectionResult.annotated_image}
                  alt="Détections annotées"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>
        )}
      </CameraCard>
      <div>
        {isProcessing && (
          <div className={classes.imageIsProcessing}>
            Traitement en cours...
          </div>
        )}

        {isStreamingMode && (
          <div className={classes.modeEnTempsReelContainer}>
            🔴 MODE TEMPS RÉEL ACTIF
          </div>
        )}
      </div>
    </Scrolled>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { Button, button_purpleVariant } from '@components/Button'
import { buttonLightVariant, buttonDangerVariant } from '@components/Button'
import { useTheme } from '@components/theme'
import { Export, Camera, Trash } from '@components/icons'
import { useStyles } from './styles'
import { CameraCard } from '@components/CameraCard'
import { Scrolled } from '@components/Scrolled'
import { CameraView } from '@components/CameraView'
import { DetectionsGrid } from '@components/DetectionsGrid'
import { MQTTStatusIndicator } from '@components/MQTTStatusIndicator'
import { DetectionResult } from '@components/DetectionResult'
import { DetectionFromDB, DetectionResultData } from '@/types'
import {
  uploadImageForDetection,
  getDetections,
  deleteAllDetections,
} from './utils/backend'
import { mqttObservable } from './utils/mqttObservable'

export const Home = () => {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectionResult, setDetectionResult] =
    useState<DetectionResultData | null>(null)
  const [isStreamingMode, setIsStreamingMode] = useState(false)
  const [detections, setDetections] = useState<DetectionFromDB[]>([])
  const [isLoadingDetections, setIsLoadingDetections] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isMqttConnected, setIsMqttConnected] = useState(false)

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

  const fetchDetections = async () => {
    try {
      setIsLoadingDetections(true)
      const data = await getDetections(20)
      setDetections(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des détections:', error)
    } finally {
      setIsLoadingDetections(false)
    }
  }

  const sendImageToBackend = async (imageData: string) => {
    try {
      setIsProcessing(true)

      const result = await uploadImageForDetection(imageData)
      console.log('Image envoyée avec succès:', result)

      setTimeout(() => {
        fetchDetections()
      }, 2000)
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

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        'Êtes-vous sûr de vouloir supprimer toutes les détections et leurs images ? Cette action est irréversible.'
      )
    ) {
      return
    }

    try {
      setIsLoadingDetections(true)
      const result = await deleteAllDetections()
      console.log('✅ Suppression réussie:', result)
      alert(
        `Toutes les détections ont été supprimées (${result.deleted_images} images)`
      )
      // Rafraîchir la liste
      setDetections([])
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression des détections')
    } finally {
      setIsLoadingDetections(false)
    }
  }

  useEffect(() => {
    fetchDetections()

    const unsubscribe = mqttObservable.subscribe((detection) => {
      console.log('🔔 New detection received via MQTT:', detection)
      fetchDetections()
    })

    const unsubscribeStatus = mqttObservable.subscribeToStatus(
      (isConnected) => {
        console.log('🔌 MQTT connection status changed:', isConnected)
        setIsMqttConnected(isConnected)
      }
    )

    return () => {
      stopStreaming()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      unsubscribe()
      unsubscribeStatus()
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
          <CameraView
            selectedImage={selectedImage}
            isCameraOpen={isCameraOpen}
            videoRef={videoRef}
            theme={theme}
            onClose={() => setSelectedImage(null)}
          />
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
          <DetectionResult detectionResult={detectionResult} theme={theme} />
        )}
      </CameraCard>

      <div className={classes.statusContainer}>
        {isProcessing && (
          <div className={classes.imageIsProcessing}>
            ⚙️ Traitement en cours...
          </div>
        )}

        {isStreamingMode && (
          <div className={classes.modeEnTempsReelContainer}>
            🔴 MODE TEMPS RÉEL ACTIF
          </div>
        )}

        <MQTTStatusIndicator isConnected={isMqttConnected} theme={theme} />
      </div>

      <CameraCard ctx={{ theme }}>
        <div className={classes.containerCamera}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div>
              <p className={classes.text}>Détections Récentes</p>
              <p>Historique des détections d'objets</p>
            </div>
            {detections.length > 0 && (
              <Button
                ctx={{ theme }}
                onClick={handleDeleteAll}
                label="Tout Supprimer"
                variants={buttonDangerVariant}
              >
                <span style={{ fontSize: '18px' }}>
                  <Trash height={24} width={24} />
                </span>
              </Button>
            )}
          </div>

          <DetectionsGrid
            detections={detections}
            theme={theme}
            isLoading={isLoadingDetections}
          />
        </div>
      </CameraCard>
    </Scrolled>
  )
}

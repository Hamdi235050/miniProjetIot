import React, { useState, useRef, useEffect } from 'react'
import { Button, button_purpleVariant } from '@components/Button'
import { buttonLightVariant } from '@components/Button'
import { useTheme } from '@components/theme'
import { Export, Camera, Close } from '@components/icons'
import { useStyles } from './styles'
import { CameraCard } from '@components/CameraCard'
export const Home = () => {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

  const handleSend = () => {
    console.log('Sending image...')
    setSelectedImage(null)
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

      // Wait for next tick to ensure video element is rendered
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

  const handleCapture = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      setSelectedImage(dataUrl)
    }
    handleCloseCamera()
  }

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause()
        // @ts-ignore
        videoRef.current.srcObject = null
      } catch (e) {
        // ignore
      }
    }
    setIsCameraOpen(false)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  return (
    <div className={classes.container}>
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
                style={classes.video}
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
              <Button
                ctx={{ theme }}
                onClick={handleSend}
                label="Envoyer"
                variants={button_purpleVariant}
              >
                <Export width={15} height={15} />
              </Button>
            ) : isCameraOpen ? (
              <Button
                ctx={{ theme }}
                onClick={handleCapture}
                label="Prendre Photo"
                variants={button_purpleVariant}
              >
                <Camera width={15} height={15} />
              </Button>
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
      </CameraCard>
    </div>
  )
}

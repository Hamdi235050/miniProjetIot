import mqtt, { MqttClient } from 'mqtt'
import { config } from '../config/env'
import { Detection } from '../types'
import { saveDetection } from './databaseService'
import { saveImage } from './imageService'

let mqttClient: MqttClient
let latestDetection: Detection | null = null

export function initMqttClient(): void {
  mqttClient = mqtt.connect(
    `mqtts://${config.mqtt.broker}:${config.mqtt.port}`,
    {
      username: config.mqtt.username,
      password: config.mqtt.password,
      protocol: 'mqtts',
      rejectUnauthorized: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      clean: true,
    }
  )

  mqttClient.on('connect', () => {
    console.log('✅ Connecté au broker MQTT')
    mqttClient.subscribe(config.mqtt.topicDetections, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`📡 Abonné au topic: ${config.mqtt.topicDetections}`)
      } else {
        console.error(`❌ Erreur d'abonnement au topic:`, err)
      }
    })
  })

  mqttClient.on('message', async (topic: string, message: Buffer) => {
    if (topic === config.mqtt.topicDetections) {
      try {
        const data: Detection = JSON.parse(message.toString())
        latestDetection = data
        console.log(`🔍 Détection reçue: ${data.count} objet(s)`)

        // Sauvegarder l'image si présente
        if (data.annotated_image) {
          const imagePath = saveImage(data.annotated_image)
          data.image_path = imagePath
        }

        await saveDetection(data).catch((err) =>
          console.error('Erreur saveDetection:', err)
        )
      } catch (err) {
        console.error('Erreur parsing message MQTT:', err)
      }
    }
  })

  mqttClient.on('error', (err) => {
    console.error('❌ Erreur MQTT:', err)
  })
}

export function publishImage(image: string, timestamp: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!mqttClient || !mqttClient.connected) {
      reject(new Error('MQTT client not connected'))
      return
    }

    const payload = {
      image,
      timestamp,
    }

    mqttClient.publish(
      config.mqtt.topicImages,
      JSON.stringify(payload),
      { qos: 1, retain: false },
      (err) => {
        if (err) {
          console.error('❌ Erreur publication MQTT:', err)
          reject(err)
        } else {
          console.log('📤 Image envoyée au service YOLO')
          console.log(`   Topic: ${config.mqtt.topicImages}`)
          resolve()
        }
      }
    )
  })
}

export function getLatestDetection(): Detection | null {
  return latestDetection
}

export function getMqttClient(): MqttClient {
  return mqttClient
}

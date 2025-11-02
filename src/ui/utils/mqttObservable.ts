import mqtt, { MqttClient, IClientSubscribeOptions } from 'mqtt'

type DetectionCallback = (detection: any) => void

class MQTTObservable {
  private client: MqttClient | null = null
  private callbacks: Set<DetectionCallback> = new Set()
  private isConnected = false

  constructor() {
    this.connect()
  }

  private connect() {
    const brokerUrl =
      import.meta.env.VITE_MQTT_BROKER_WS ||
      'wss://055475704346454fa08a98c6ef6effad.s1.eu.hivemq.cloud:8884/mqtt'
    const username = import.meta.env.VITE_MQTT_USERNAME || 'hamdi'
    const password = import.meta.env.VITE_MQTT_PASSWORD || 'Hamdi123'
    const topic =
      import.meta.env.VITE_MQTT_TOPIC_DETECTIONS || 'iot/yolo/detections'

    try {
      this.client = mqtt.connect(brokerUrl, {
        username,
        password,
        clean: true,
        reconnectPeriod: 5000,
      })

      this.client.on('connect', () => {
        console.log('✅ Connected to MQTT broker')
        this.isConnected = true

        this.client?.subscribe(
          topic,
          { qos: 1 } as IClientSubscribeOptions,
          (err: Error | null) => {
            if (err) {
              console.error('❌ Failed to subscribe to topic:', err)
            } else {
              console.log(`✅ Subscribed to topic: ${topic}`)
            }
          }
        )
      })

      this.client.on('message', (receivedTopic: string, message: Buffer) => {
        try {
          const detection = JSON.parse(message.toString())
          console.log('📩 Received detection:', detection)

          // Notify all subscribers
          this.callbacks.forEach((callback) => callback(detection))
        } catch (error) {
          console.error('Error parsing MQTT message:', error)
        }
      })

      this.client.on('error', (error: Error) => {
        console.error('❌ MQTT connection error:', error)
        this.isConnected = false
      })

      this.client.on('close', () => {
        console.log('🔌 MQTT connection closed')
        this.isConnected = false
      })

      this.client.on('reconnect', () => {
        console.log('🔄 Reconnecting to MQTT broker...')
      })
    } catch (error) {
      console.error('❌ Failed to create MQTT client:', error)
    }
  }

  subscribe(callback: DetectionCallback) {
    this.callbacks.add(callback)

    return () => {
      this.callbacks.delete(callback)
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
      this.isConnected = false
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

export const mqttObservable = new MQTTObservable()

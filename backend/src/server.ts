import { createApp } from './app'
import { config } from './config/env'
import { initDatabase } from './config/database'
import { initMqttClient } from './services/mqttService'
import { initImagesDirectory } from './services/imageService'

async function startServer(): Promise<void> {
  try {
    initImagesDirectory()

    await initDatabase()
    console.log('✅ Base de données initialisée')

    initMqttClient()
    console.log('✅ Client MQTT initialisé')

    const app = createApp()
    const port = config.port

    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`)
      console.log(`📡 MQTT Broker: ${config.mqtt.broker}:${config.mqtt.port}`)
      console.log(
        `🗄️  Database: ${config.database.type} - ${config.database.database}`
      )
    })
  } catch (err) {
    console.error('❌ Échec du démarrage du serveur:', err)
    process.exit(1)
  }
}

startServer()

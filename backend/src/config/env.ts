import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || '3000',
  
  mqtt: {
    broker: process.env.MQTT_BROKER || '',
    port: parseInt(process.env.MQTT_PORT || '8883', 10),
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || '',
    topicImages: process.env.MQTT_TOPIC_IMAGES || '',
    topicDetections: process.env.MQTT_TOPIC_DETECTIONS || '',
  },
  
  database: {
    type: (process.env.DB_TYPE as 'mysql' | 'sqlite') || 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'iot_detections',
  },
};

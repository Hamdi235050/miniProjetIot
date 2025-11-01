const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Dossier images créé: ${IMAGES_DIR}`);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuration MQTT
const MQTT_BROKER = process.env.MQTT_BROKER 
const MQTT_PORT = process.env.MQTT_PORT  
const MQTT_USERNAME = process.env.MQTT_USERNAME  
const MQTT_PASSWORD = process.env.MQTT_PASSWORD 
const TOPIC_IMAGES = process.env.MQTT_TOPIC_IMAGES  
const TOPIC_DETECTIONS = process.env.MQTT_TOPIC_DETECTIONS  
 
const DB_TYPE = process.env.DB_TYPE;

const MYSQL_HOST = process.env.MYSQL_HOST  ;
const MYSQL_PORT = process.env.MYSQL_PORT  ;
const MYSQL_USER = process.env.MYSQL_USER ;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD  ;
const MYSQL_DB = process.env.MYSQL_DB  ;

 const mqttClient = mqtt.connect(`mqtts://${MQTT_BROKER}:${MQTT_PORT}`, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  protocol: 'mqtts',
  rejectUnauthorized: true
});
let latestDetection = null;

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT');
  mqttClient.subscribe(TOPIC_DETECTIONS, (err) => {
    if (!err) {
      console.log(`📡 Abonné au topic: ${TOPIC_DETECTIONS}`);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  if (topic === TOPIC_DETECTIONS) {
    try {
      const data = JSON.parse(message.toString());
      latestDetection = data;
      console.log(`🔍 Détection reçue: ${data.count} objet(s)`);

       await saveDetection(data).catch(err => console.error('Erreur saveDetection:', err));
    } catch (err) {
      console.error('Erreur parsing message MQTT:', err);
    }
  }
});

// Database initialization: MySQL (mysql2) if requested, otherwise SQLite (better-sqlite3)
let db = null; // sqlite instance
let pool = null; // mysql pool

   (async () => {
    try {
      console.log('🔄 Tentative de connexion à MySQL...');
      console.log(`   Host: ${MYSQL_HOST}`);
      console.log(`   Port: ${MYSQL_PORT}`);
      console.log(`   User: ${MYSQL_USER}`);
      console.log(`   Database: ${MYSQL_DB}`);
      
      pool = mysql.createPool({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB,
        waitForConnections: true,
        connectionLimit: 10
      });
      
      pool.query = util.promisify(pool.query).bind(pool);
      pool.end = util.promisify(pool.end).bind(pool);
      
     
    } catch (err) {
      console.error('❌ Erreur connexion MySQL:', err.message);
      console.error('   Code:', err.code);
      console.error('   Stack:', err.stack);
    }
  })();
 

async function initDatabase() {
  console.log('🔄 Initialisation de la base de données...');

  try {
    // 1️⃣ Créer une connexion sans base spécifique
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
    });
   
    // 2️⃣ Créer la base si elle n’existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\``);
    console.log(`✅ Base de données "${MYSQL_DB}" vérifiée/créée avec succès.`);
    await connection.end();

    // 3️⃣ Créer le pool de connexion avec la base sélectionnée
    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,
    });

     const createSQL = `
      CREATE TABLE IF NOT EXISTS detections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp TEXT,
        count INT,
        detections JSON,
        image_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;

    console.log('   Création de la table "detections"...');
    await pool.query(createSQL);
    console.log('✅ Table "detections" vérifiée/créée avec succès.');

     const [columns] = await pool.query('DESCRIBE detections');
     columns.forEach(col => console.log(`      - ${col.Field}: ${col.Type}`));

    return pool;
  } catch (err) {
    console.error('❌ Erreur lors de l’initialisation de la base de données :', err.message);
    throw err;
  }
}
 
async function saveDetection(data) {
  console.log('💾 Sauvegarde de la détection...');
  
  const ts = data.timestamp || new Date().toISOString();
  const count = data.count || 0;
  const detectionsJson = JSON.stringify(data.detections || []);
  const annotated = data.annotated_image || null;
  
  let imagePath = null;
  
  // Sauvegarder l'image dans le dossier images
  if (annotated) {
    try {
      const filename = `detection_${Date.now()}.jpg`;
      imagePath = path.join(IMAGES_DIR, filename);
      
      // Extraire les données base64 et sauvegarder
      const base64Data = annotated.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(imagePath, base64Data, 'base64');
      console.log(`   ✅ Image sauvegardée: ${filename}`);
    } catch (err) {
      console.error('   ❌ Erreur sauvegarde image:', err.message);
    }
  }

  try {
    if (DB_TYPE === 'mysql') {
      const insertSQL = `
        INSERT INTO detections (timestamp, count, detections, image_path)
        VALUES (?, ?, ?, ?)
      `;
      const result = await pool.query(insertSQL, [ts, count, detectionsJson, imagePath]);
      console.log(`   ✅ Détection MySQL sauvegardée (ID: ${result.insertId})`);
      console.log(`      - Count: ${count}`);
      console.log(`      - Image: ${imagePath ? path.basename(imagePath) : 'N/A'}`);
    } else {
      const stmt = db.prepare(`
        INSERT INTO detections (timestamp, count, detections, image_path)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(ts, count, detectionsJson, imagePath);
      console.log(`   ✅ Détection SQLite sauvegardée (ID: ${result.lastInsertRowid})`);
      console.log(`      - Count: ${count}`);
      console.log(`      - Image: ${imagePath ? path.basename(imagePath) : 'N/A'}`);
    }
  } catch (err) {
    console.error('   ❌ Erreur sauvegarde en base de données:', err.message);
    throw err;
  }
}

// Routes API

// Endpoint de test
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from IoT Backend with YOLO!' });
});

// Envoyer une image pour détection
app.post('/api/detect', (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image requise' });
    }
    
    const payload = {
      image: image,
      timestamp: new Date().toISOString()
    };
    
    mqttClient.publish(TOPIC_IMAGES, JSON.stringify(payload), (err) => {
      if (err) {
        console.error('Erreur publication MQTT:', err);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi' });
      }
      
      console.log('📤 Image envoyée au service YOLO');
      res.json({ 
        success: true, 
        message: 'Image envoyée pour détection',
        timestamp: payload.timestamp
      });
    });
    
  } catch (error) {
    console.error('Erreur /api/detect:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer la dernière détection
app.get('/api/detection/latest', (req, res) => {
  if (latestDetection) {
    res.json(latestDetection);
  } else {
    // Retourner un message informatif au lieu d'une erreur 404
    res.json({ 
      message: 'En attente de détection...',
      count: 0,
      detections: [],
      status: 'waiting'
    });
  }
});

 app.get('/api/detections', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    let rows;
    if (DB_TYPE === 'mysql') {
      const r = await pool.query(
        `SELECT id, timestamp, count, detections, created_at FROM detections ORDER BY created_at DESC LIMIT ?`,
        [parseInt(limit, 10)]
      );
      rows = r.map(row => ({
        ...row,
        detections: typeof row.detections === 'string' ? JSON.parse(row.detections) : row.detections
      }));
    } else {
      const stmt = db.prepare(`
        SELECT id, timestamp, count, detections, created_at 
        FROM detections 
        ORDER BY created_at DESC 
        LIMIT ?
      `);
      rows = stmt.all(limit).map(row => ({
        ...row,
        detections: JSON.parse(row.detections)
      }));
    }

    res.json(rows);
  } catch (err) {
    console.error('Erreur DB:', err);
    res.status(500).json({ error: err.message });
  }
});

 app.get('/api/detection/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (DB_TYPE === 'mysql') {
      const rows = await pool.query(`SELECT * FROM detections WHERE id = ?`, [id]);
      const row = rows[0];
      if (!row) return res.status(404).json({ message: 'Détection non trouvée' });
      return res.json({ ...row, detections: typeof row.detections === 'string' ? JSON.parse(row.detections) : row.detections });
    } else {
      const stmt = db.prepare(`SELECT * FROM detections WHERE id = ?`);
      const row = stmt.get(id);
      if (!row) return res.status(404).json({ message: 'Détection non trouvée' });
      return res.json({ ...row, detections: JSON.parse(row.detections) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 app.get('/api/stats', async (req, res) => {
  try {
    if (DB_TYPE === 'mysql') {
      const rows = await pool.query(`
        SELECT 
          COUNT(*) as total_detections,
          SUM(count) as total_objects,
          AVG(count) as avg_objects_per_image
        FROM detections
      `);
      return res.json(rows[0]);
    }

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_detections,
        SUM(count) as total_objects,
        AVG(count) as avg_objects_per_image
      FROM detections
    `);
    const stats = stmt.get();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 const port = process.env.PORT  
initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`connecté a  http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Échec initialisation DB:', err);
    process.exit(1);
  });

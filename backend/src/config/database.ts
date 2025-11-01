import mysql from 'mysql'
import { promisify } from 'util'
import { config } from './env'

export interface DatabasePool {
  query: (sql: string, values?: any[]) => Promise<any>
  end: () => Promise<void>
}

let pool: DatabasePool | null = null

export async function initDatabase(): Promise<DatabasePool> {
  console.log('🔄 Initialisation de la base de données...')

  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    })

    await promisify(connection.query).bind(connection)(
      `CREATE DATABASE IF NOT EXISTS \`${config.database.database}\``
    )

    await promisify(connection.end).bind(connection)()

    const mysqlPool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      waitForConnections: true,
      connectionLimit: 10,
    })

    pool = {
      query: promisify(mysqlPool.query).bind(mysqlPool),
      end: promisify(mysqlPool.end).bind(mysqlPool),
    }

    const createSQL = `
      CREATE TABLE IF NOT EXISTS detections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp TEXT,
        count INT,
        detections JSON,
        image_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `

    console.log('   Création de la table "detections"...')
    await pool.query(createSQL)
    console.log('✅ Table "detections" vérifiée/créée avec succès.')

    const columns = await pool.query('DESCRIBE detections')
    columns.forEach((col: any) =>
      console.log(`      - ${col.Field}: ${col.Type}`)
    )

    return pool
  } catch (err) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données :",
      (err as Error).message
    )
    throw err
  }
}

export function getPool(): DatabasePool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.')
  }
  return pool
}

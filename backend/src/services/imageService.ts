import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.join(__dirname, '../../images')

export function initImagesDirectory(): void {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
    console.log(`📁 Dossier images créé: ${IMAGES_DIR}`)
  }
}

export function saveImage(base64Image: string): string | null {
  try {
    const filename = `detection_${Date.now()}.jpg`
    const imagePath = path.join(IMAGES_DIR, filename)

    // Extraire les données base64 et sauvegarder
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
    fs.writeFileSync(imagePath, base64Data, 'base64')
    console.log(`   ✅ Image sauvegardée: ${filename}`)

    return imagePath
  } catch (err) {
    console.error('   ❌ Erreur sauvegarde image:', (err as Error).message)
    return null
  }
}

export function getImagesDirectory(): string {
  return IMAGES_DIR
}

# Backend IoT - TypeScript Migration

Ce projet a été migré de JavaScript vers TypeScript pour une meilleure maintenabilité et type safety.

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/           # Configuration de l'application
│   │   ├── database.ts   # Configuration et initialisation de la base de données
│   │   └── env.ts        # Variables d'environnement
│   ├── controllers/      # Contrôleurs pour gérer les requêtes
│   │   └── detectionController.ts
│   ├── routes/           # Définition des routes API
│   │   └── detectionRoutes.ts
│   ├── services/         # Services métier
│   │   ├── databaseService.ts
│   │   ├── imageService.ts
│   │   └── mqttService.ts
│   ├── types/            # Définitions de types TypeScript
│   │   └── index.ts
│   ├── app.ts            # Configuration Express
│   └── server.ts         # Point d'entrée de l'application
├── images/               # Stockage des images détectées
├── dist/                 # Fichiers compilés (généré automatiquement)
├── .env                  # Variables d'environnement (à créer)
├── .env.example          # Exemple de configuration
├── package.json
├── tsconfig.json
└── index.js              # Ancien fichier (conservé pour référence)
```

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# ou avec pnpm
pnpm install
```

## ⚙️ Configuration

1. Copier le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

2. Modifier les valeurs dans `.env` selon votre configuration.

## 🔧 Scripts disponibles

```bash
# Développement (avec rechargement automatique)
npm run dev

# Compiler TypeScript en JavaScript
npm run build

# Compiler en mode watch (recompile à chaque changement)
npm run watch

# Démarrer en production (après build)
npm start

# Démarrer l'ancienne version JavaScript
npm run start:old
```

## 🏗️ Développement

### Mode développement

En mode développement, utilisez:

```bash
npm run dev
```

Cela lancera le serveur avec `ts-node` et `nodemon` pour un rechargement automatique.

### Mode production

Pour la production:

```bash
# 1. Compiler le TypeScript
npm run build

# 2. Démarrer le serveur
npm start
```

## 📝 Types principaux

### Detection

```typescript
interface Detection {
  id?: number
  timestamp: string
  count: number
  detections: DetectionItem[]
  image_path?: string | null
  created_at?: string
  annotated_image?: string
}
```

### DetectionItem

```typescript
interface DetectionItem {
  class: string
  confidence: number
  bbox?: number[]
}
```

## 🔌 API Endpoints

### GET `/api/hello`

Test endpoint - retourne un message de bienvenue.

### POST `/api/detect`

Envoie une image pour détection YOLO.

```json
{
  "image": "base64_image_string"
}
```

### GET `/api/detection/latest`

Récupère la dernière détection.

### GET `/api/detections?limit=50`

Récupère la liste des détections (limite configurable).

### GET `/api/detection/:id`

Récupère une détection spécifique par ID.

### GET `/api/stats`

Récupère les statistiques globales.

## 🔄 Migration depuis l'ancien code

L'ancien fichier `index.js` est conservé pour référence. Les principales améliorations:

- ✅ Type safety avec TypeScript
- ✅ Architecture modulaire (services, controllers, routes)
- ✅ Séparation des préoccupations
- ✅ Meilleure maintenabilité
- ✅ Gestion d'erreurs améliorée
- ✅ Configuration centralisée

## 🐛 Debugging

Pour débugger avec VS Code, ajoutez cette configuration dans `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/server.ts"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector",
      "sourceMaps": true
    }
  ]
}
```

## 📦 Dépendances principales

- **express**: Framework web
- **mqtt**: Client MQTT pour communication
- **mysql**: Driver MySQL
- **dotenv**: Gestion des variables d'environnement
- **cors**: Support CORS

## 📦 Dépendances de développement

- **typescript**: Compilateur TypeScript
- **ts-node**: Exécution directe de TypeScript
- **@types/\***: Définitions de types pour les librairies
- **nodemon**: Rechargement automatique en développement

## 🎯 Prochaines étapes

- [ ] Ajouter des tests unitaires (Jest)
- [ ] Ajouter validation des données (Zod/Joi)
- [ ] Implémenter le logging structuré (Winston)
- [ ] Ajouter la documentation API (Swagger)
- [ ] Containerisation avec Docker

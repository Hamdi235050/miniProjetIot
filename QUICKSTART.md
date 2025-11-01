# 🚀 Guide de Démarrage Rapide

## Installation des dépendances

### 1. Backend

```bash
cd backend
npm install
```

### 2. Frontend

```bash
cd ..
npm install
```

### 3. Service YOLO

```bash
cd yolo-service
pip install -r requirements.txt
```

## Démarrage du système

Ouvrez **3 terminaux** et lancez chaque service dans l'ordre :

### Terminal 1 - Backend

```bash
cd backend
node index.js
```

✅ Le backend démarre sur http://localhost:3000

### Terminal 2 - Service YOLO

```bash
cd yolo-service
python detection.py
```

✅ Le service YOLO écoute les images sur MQTT

### Terminal 3 - Frontend

```bash
npm run dev
```

✅ Le frontend démarre sur http://localhost:5173

## Test rapide

1. Ouvrez votre navigateur : http://localhost:5173
2. Cliquez sur **"Ouvrir la caméra"**
3. Cliquez sur **"Prendre Photo"**
4. Attendez 2-3 secondes
5. Les détections s'affichent ! 🎉

## Mode Temps Réel

1. Cliquez sur **"Ouvrir la caméra"**
2. Cliquez sur **"Mode Temps Réel"**
3. Le système analyse automatiquement toutes les 3 secondes
4. Cliquez sur **"Arrêter Stream"** pour stopper

## Vérification

### Backend

```bash
curl http://localhost:3000/api/hello
# Devrait retourner : {"message":"Hello from IoT Backend with YOLO!"}
```

### Dernière détection

```bash
curl http://localhost:3000/api/detection/latest
```

### Statistiques

```bash
curl http://localhost:3000/api/stats
```

## Structure des services

```
miniProjetIot/
├── backend/          # Serveur Node.js + MQTT + SQLite
├── yolo-service/     # Service Python YOLO
├── src/              # Frontend React
└── components/       # Composants UI
```

## Problèmes courants

### Port déjà utilisé

Si le port 3000 ou 5173 est occupé, modifiez-le dans :

- Backend : `backend/index.js` (variable `port`)
- Frontend : `vite.config.ts`

### Caméra non détectée

- Vérifiez les permissions du navigateur
- Utilisez Chrome ou Edge (meilleur support WebRTC)

### Service YOLO ne démarre pas

```bash
# Installez les dépendances manquantes
pip install ultralytics opencv-python paho-mqtt python-dotenv numpy
```

## Configuration MQTT

Le projet est configuré pour utiliser HiveMQ Cloud.
Si vous voulez changer de broker, modifiez les fichiers `.env` :

- `backend/.env`
- `yolo-service/.env`

## Support

En cas de problème :

1. Vérifiez que les 3 services sont bien démarrés
2. Consultez les logs dans chaque terminal
3. Vérifiez la console du navigateur (F12)

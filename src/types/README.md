# Types Partagés

Ce dossier contient les types TypeScript partagés à travers l'application.

## Structure

### `detections.ts`

Types liés aux détections d'objets YOLO :

- **`Detection`** : Représente une détection d'objet individuelle avec label, confidence et bbox
- **`DetectionResultData`** : Résultat d'une détection en temps réel (avec image annotée)
- **`DetectionFromDB`** : Représentation d'une détection stockée en base de données

## Utilisation

```typescript
import { Detection, DetectionResultData, DetectionFromDB } from '@/types'
```

## Convention

- Tous les types partagés doivent être exportés depuis `index.ts`
- Les types spécifiques à un composant restent dans le dossier du composant
- Utilisez l'alias `@/types` pour importer les types partagés

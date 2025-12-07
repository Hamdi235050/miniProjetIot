import os
from dotenv import load_dotenv
import json
import paho.mqtt.client as mqtt
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from datetime import datetime
import ssl
# Charger les variables d'environnement depuis le fichier .env
load_dotenv()
# Charger les variables d'environnement
MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT"))
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
TOPIC_IMAGES = os.getenv("MQTT_TOPIC_IMAGES")
TOPIC_DETECTIONS = os.getenv("MQTT_TOPIC_DETECTIONS")
# Charger le modèle YOLOv8 pré-entraîné
print("Chargement du modèle YOLOv8...")
model = YOLO("best.pt")
print("Modèle chargé avec succès!")
# Fonction pour traiter l'image et effectuer la détection
def process_image(image_base64):
    """
    Traite une image en base64 et effectue la détection d'objets
    Retourne les détections et l'image annotée
    """
    try:
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        # Décoder l'image depuis le format base64
        img_data = base64.b64decode(image_base64)
        #   Convertir les données en tableau numpy
        nparr = np.frombuffer(img_data, np.uint8)
        # Lire l'image avec OpenCV
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Vérifier si l'image a été correctement décodée
        if image is None:
            print("[ERROR] Impossible de décoder l'image")
            return None
        # Effectuer la détection avec le modèle YOLOv8
        results = model(image, conf=0.25)
        # Extraire les détections
        detections = []
        # Parcourir les résultats
        for result in results:
            # Récupérer les boîtes englobantes
            boxes = result.boxes
           # Parcourir chaque boîte détectée
            for box in boxes:
                # Extraire les coordonnées, la confiance et la classe
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                # Convertir les valeurs en float et int
                conf = float(box.conf[0])
                # Récupérer le label de la classe
                cls = int(box.cls[0])
                # Récupérer le nom de la classe
                label = model.names[cls]
                # Ajouter la détection à la liste
                detections.append({
                    # Informations sur la détection
                    'label': label,

                    'confidence': round(conf, 3),
                    'bbox': [round(x1), round(y1), round(x2), round(y2)]
                })
        
        # Créer l'image annotée
        annotated_image = results[0].plot()
        
        # Encoder l'image annotée en base64
        _, buffer = cv2.imencode('.jpg', annotated_image)
        # Convertir en base64
        annotated_base64 = base64.b64encode(buffer).decode('utf-8')
        # Préparer le data URL
        annotated_data_url = f"data:image/jpeg;base64,{annotated_base64}"
        # Retourner les résultats
        return {
            # Informations sur les détections
            'detections': detections,
            'count': len(detections),
            'annotated_image': annotated_data_url,
            'timestamp': datetime.now().isoformat()
        }
        # Fin de la fonction
    except Exception as e:
        print(f"[ERROR] Erreur lors du traitement: {e}")
        return None
# Callback MQTT pour la réception des messages
def on_message(client, userdata, msg):
    """
    Callback appelé quand un message arrive sur le topic iot/images
    """
    try:
        # Décoder le message JSON
        data = json.loads(msg.payload.decode())
        print(f"[MQTT] Image reçue sur {msg.topic}")
        # Vérifier la présence de l'image dans le message
        if 'image' not in data:
            print("[ERROR] Pas d'image dans le message")
            return
        # Traiter l'image et obtenir les résultats
        result = process_image(data['image'])
        # Vérifier si des résultats ont été obtenus
        if result:
            # Ajouter l'image_path s'il est présent dans le message reçu
            if 'image_path' in data:
                # Ajouter le chemin de l'image aux résultats
                result['image_path'] = data['image_path']
                # Afficher le chemin de l'image pour le débogage
                print(f"[INFO] Image path: {data['image_path']}")
            
            # Ajouter le timestamp original s'il existe
            if 'timestamp' in data:
                # Ajouter le timestamp original aux résultats
                result['timestamp'] = data['timestamp']
            # Afficher les résultats pour le débogage
            print(f"[YOLO] {result['count']} objet(s) détecté(s)")
            for det in result['detections']:
                print(f"  - {det['label']} (conf: {det['confidence']:.2f})")
            # Publier les résultats sur le topic MQTT des détections
            client.publish(
                TOPIC_DETECTIONS,
                json.dumps(result),
                qos=1
            )
            print(f"[MQTT] Résultats publiés sur {TOPIC_DETECTIONS}")
        # Fin de la fonction
    except Exception as e:
        print(f"[ERROR] Erreur dans on_message: {e}")
# Callback MQTT pour la connexion
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"[MQTT] Connecté au broker {MQTT_BROKER}:{MQTT_PORT}")
        # S'abonner au topic des images
        client.subscribe(TOPIC_IMAGES)
        print(f"[MQTT] Abonné au topic: {TOPIC_IMAGES}")
        print("[YOLO] En attente d'images à traiter...")
    else:
        print(f"[MQTT] Échec de connexion, code: {rc}")
# Callback MQTT pour la déconnexion
def on_disconnect(client, userdata, rc):
    if rc != 0:
        print(f"[MQTT] Déconnexion inattendue, code: {rc}")
# Initialiser le client MQTT et configurer les callbacks
mqtt_client = mqtt.Client()
# Configurer l'authentification
mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
# Configurer les callbacks
mqtt_client.on_connect = on_connect
# Configurer le callback pour la réception des messages
mqtt_client.on_message = on_message
# Configurer le callback pour la déconnexion
mqtt_client.on_disconnect = on_disconnect
# Configurer TLS/SSL
mqtt_client.tls_set(cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLS)
# Se connecter au broker MQTT
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
# Lancer la boucle principale MQTT
mqtt_client.loop_forever() 
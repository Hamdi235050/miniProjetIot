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

 load_dotenv()

MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT"))
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
TOPIC_IMAGES = os.getenv("MQTT_TOPIC_IMAGES")
TOPIC_DETECTIONS = os.getenv("MQTT_TOPIC_DETECTIONS")

print("Chargement du modèle YOLOv8...")
model = YOLO("yolov8n.pt")
print("Modèle chargé avec succès!")

def process_image(image_base64):
    """
    Traite une image en base64 et effectue la détection d'objets
    Retourne les détections et l'image annotée
    """
    try:
         if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        img_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            print("[ERROR] Impossible de décoder l'image")
            return None
        
         results = model(image, conf=0.25)
        
         detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                label = model.names[cls]
                
                detections.append({
                    'label': label,
                    'confidence': round(conf, 3),
                    'bbox': [round(x1), round(y1), round(x2), round(y2)]
                })
        
        # Créer l'image annotée
        annotated_image = results[0].plot()
        
        # Encoder l'image annotée en base64
        _, buffer = cv2.imencode('.jpg', annotated_image)
        annotated_base64 = base64.b64encode(buffer).decode('utf-8')
        annotated_data_url = f"data:image/jpeg;base64,{annotated_base64}"
        
        return {
            'detections': detections,
            'count': len(detections),
            'annotated_image': annotated_data_url,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"[ERROR] Erreur lors du traitement: {e}")
        return None

 def on_message(client, userdata, msg):
    """
    Callback appelé quand un message arrive sur le topic iot/images
    """
    try:
        data = json.loads(msg.payload.decode())
        print(f"[MQTT] Image reçue sur {msg.topic}")
        
        if 'image' not in data:
            print("[ERROR] Pas d'image dans le message")
            return
        
        result = process_image(data['image'])
        
        if result:
            print(f"[YOLO] {result['count']} objet(s) détecté(s)")
            for det in result['detections']:
                print(f"  - {det['label']} (conf: {det['confidence']:.2f})")
            
             client.publish(
                TOPIC_DETECTIONS,
                json.dumps(result),
                qos=1
            )
            print(f"[MQTT] Résultats publiés sur {TOPIC_DETECTIONS}")
        
    except Exception as e:
        print(f"[ERROR] Erreur dans on_message: {e}")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"[MQTT] Connecté au broker {MQTT_BROKER}:{MQTT_PORT}")
        client.subscribe(TOPIC_IMAGES)
        print(f"[MQTT] Abonné au topic: {TOPIC_IMAGES}")
        print("[YOLO] En attente d'images à traiter...")
    else:
        print(f"[MQTT] Échec de connexion, code: {rc}")

def on_disconnect(client, userdata, rc):
    if rc != 0:
        print(f"[MQTT] Déconnexion inattendue, code: {rc}")

 mqtt_client = mqtt.Client()
mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.on_disconnect = on_disconnect

 mqtt_client.tls_set(cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLS)

mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)

mqtt_client.loop_forever() 
# Backend for mini-projet-iot

This folder contains a minimal Express backend used during development.

How to run

1. Install dependencies:

   npm install

2. Start in development (auto-restart):

   npm run dev

3. The server listens on port 3000 by default. Test: GET /api/hello

Using HiveMQ Cloud

The backend is preconfigured to use a HiveMQ Cloud host (TLS on port 8883 by default). Configuration is done via environment variables — see `.env.example` for examples.

Key environment variables:

- `MQTT_URL` — full MQTT URL to connect to (e.g. `mqtts://<your-host>:8883`).
- `MQTT_USE_WS` — set to `true` to prefer websocket connection (will use `MQTT_WS_URL` if provided).
- `MQTT_WS_URL` — websocket URL to use (e.g. `wss://<your-host>:8884`).
- `MQTT_USERNAME` / `MQTT_PASSWORD` — optional credentials for HiveMQ Cloud.
- `MQTT_FALLBACK_WS` — set to `true` to attempt a fallback to websocket (WSS) if the TLS connection fails.

Copy `.env.example` to `.env`, edit the HiveMQ host and credentials (if required), then start the server. The backend will log connection attempts and subscription status.

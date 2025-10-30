const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Simple test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

// Optional: serve static files if you build a backend-served frontend
// const staticDir = path.join(__dirname, 'public');
// app.use(express.static(staticDir));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

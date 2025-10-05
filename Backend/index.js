// Backend/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

/*
 Project layout:
 WEB APP FINAL/
 ├─ Backend/                <-- this file lives here
 ├─ css/
 ├─ html/
 ├─ images/
 ├─ videos/
 ├─ index.html
 └─ ...
 
 We serve static files from the project root (one level up from Backend/)
*/

const PUBLIC_DIR = path.join(__dirname, '..'); // serve from project root

// Basic middleware
app.use(cors()); // for prod, restrict origin to your domain
app.use(express.json({ limit: '300kb' })); // avoid huge payloads
app.use(express.urlencoded({ extended: false }));

// Serve frontend static assets (index.html, css/, images/, videos/, html/)
app.use(express.static(PUBLIC_DIR));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

/*
  POST /api/generate
  - The client posts a JSON body (same shape you already send from index.html)
  - Server reads real API key from process.env.GENERATIVE_API_KEY (Backend/.env)
  - Server calls provider endpoint and returns sanitized result to client
*/
app.post('/api/generate', async (req, res) => {
  try {
    // quick validation
    if (!req.body || !req.body.contents) {
      return res.status(400).json({ error: 'Request must include contents' });
    }

    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      console.error('Missing GENERATIVE_API_KEY in environment');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Build provider URL (Google Generative Language example - key in query param)
    const providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    // Forward request
    const providerResp = await axios.post(providerUrl, req.body, {
      timeout: 20000 // 20s
    });

    const payload = providerResp.data;

    // Optional: normalize response to expected client shape so client parsing stays stable
    // If provider returns different structure change this block accordingly
    const safe = {
      candidates: (payload.candidates || []).map(c => ({
        content: c.content || {}
      }))
    };

    // If there are no candidates, forward the raw payload as fallback
    res.json((safe.candidates.length > 0) ? safe : payload);

  } catch (err) {
    console.error('/api/generate error:', err?.response?.data || err.message || err);
    if (err?.response?.data) {
      // forward provider error (careful with internal details)
      return res.status(err.response.status || 502).json({ error: 'provider_error', details: err.response.data });
    }
    res.status(500).json({ error: 'internal_server_error' });
  }
});

// SPA fallback (serve index.html for unknown GETs)
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

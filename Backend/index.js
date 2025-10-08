// Backend/index.js
// Express server with herbal garden domain restriction
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Project structure: Backend/ is subfolder, serve from parent directory
const PUBLIC_DIR = path.join(__dirname, '..');

// System instruction for herbal garden specialization
const HERBAL_GARDEN_SYSTEM_INSTRUCTION = `You are a specialized Virtual Herbal Garden Assistant. You ONLY answer questions related to:

**ALLOWED TOPICS:**
- Herbs, medicinal plants, and garden plants
- Growing tips, cultivation methods, and plant care
- Soil types, sunlight requirements, watering schedules
- Fertilizers, composting, and organic gardening
- Medicinal properties and Ayurvedic uses of plants
- Health benefits, nutritional value of herbs
- Harvesting, preservation, and storage of herbs
- Natural remedies, herbal teas, and home remedies
- Plant identification and botanical information
- Pest control using natural methods
- Companion planting and garden design
- Seasonal planting guides

**STRICT RULES:**
1. If a user asks about ANY topic outside the above list (politics, technology, history, entertainment, sports, etc.), respond ONLY with:
   "I can only answer questions related to herbs, plants, and gardening. Please ask me about medicinal plants, growing tips, or natural remedies!"

2. Be friendly, informative, and encouraging about gardening
3. Provide practical, actionable advice
4. Use simple language that beginners can understand
5. When appropriate, mention safety precautions for medicinal use

Always stay within your domain. Never answer off-topic questions.`;

// Middleware
app.use(cors());
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(PUBLIC_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Virtual Herbal Garden Backend',
    time: new Date().toISOString()
  });
});

/*
  POST /api/generate
  - Accepts user message with domain restriction
  - Validates domain is 'herbal-garden'
  - Adds system instruction to enforce topic restriction
  - Calls Gemini API and returns response
*/
app.post('/api/generate', async (req, res) => {
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        error: 'Empty request body',
        reply: 'Please provide a valid question about herbs or plants.'
      });
    }

    // Extract domain and user message
    const domain = req.body.domain || '';
    let userMessage = '';

    if (req.body.prompt && typeof req.body.prompt === 'string') {
      userMessage = req.body.prompt;
    } else if (req.body.message && typeof req.body.message === 'string') {
      userMessage = req.body.message;
    } else if (req.body.contents && Array.isArray(req.body.contents)) {
      if (req.body.contents[0]?.parts?.[0]?.text) {
        userMessage = req.body.contents[0].parts[0].text;
      }
    }

    // Validate domain restriction
    if (domain !== 'herbal-garden') {
      console.warn('Request without proper domain parameter');
      return res.status(400).json({
        error: 'Invalid domain',
        reply: 'I can only answer questions related to herbs, plants, and gardening.'
      });
    }

    // Validate message content
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({
        error: 'No message provided',
        reply: 'Please ask me a question about herbs or plants!'
      });
    }

    // Get API key
    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      console.error('Missing GENERATIVE_API_KEY in environment');
      return res.status(500).json({
        error: 'Server misconfiguration',
        reply: 'Service temporarily unavailable. Please try again later.'
      });
    }

    // Build request payload with system instruction
    const
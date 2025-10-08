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
    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: {
        parts: [{ text: HERBAL_GARDEN_SYSTEM_INSTRUCTION }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Build provider URL (Gemini API)
    const modelName = process.env.GENERATIVE_MODEL || 'gemini-2.0-flash-exp';
    const providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    // Call Gemini API
    const providerResp = await axios.post(providerUrl, requestPayload, {
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseData = providerResp.data;

    // Validate response structure
    if (!responseData || !responseData.candidates || responseData.candidates.length === 0) {
      console.error('Invalid response structure from Gemini');
      return res.status(502).json({
        error: 'Invalid AI response',
        reply: 'I encountered a problem processing your request. Please try again!'
      });
    }

    // Extract reply text
    const candidate = responseData.candidates[0];
    let replyText = '';

    if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
      replyText = candidate.content.parts[0].text || '';
    }

    // Additional safety check: detect off-topic responses
    const offTopicKeywords = [
      'politics', 'election', 'president', 'government', 'war', 'military',
      'movie', 'film', 'actor', 'sport', 'football', 'cricket', 'match',
      'programming', 'code', 'software', 'algorithm', 'javascript',
      'cryptocurrency', 'bitcoin', 'stock', 'investment'
    ];

    const lowerReply = replyText.toLowerCase();
    const seemsOffTopic = offTopicKeywords.some(keyword =>
      lowerReply.includes(keyword) &&
      !lowerReply.includes('plant') &&
      !lowerReply.includes('herb') &&
      !lowerReply.includes('garden')
    );

    if (seemsOffTopic) {
      replyText = "I can only answer questions related to herbs, plants, and gardening. Please ask me about medicinal plants, growing tips, or natural remedies!";
    }

    // Check for empty response
    if (!replyText || replyText.trim() === '') {
      replyText = "I'm not sure how to answer that. Could you rephrase your question about herbs or plants?";
    }

    // Return formatted response
    res.json({
      reply: replyText,
      candidates: [{
        content: {
          parts: [{ text: replyText }]
        }
      }]
    });

  } catch (err) {
    console.error('/api/generate error:', err?.response?.data || err.message || err);

    // Handle specific error types
    if (err?.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        reply: 'I\'m receiving too many requests. Please wait a moment and try again.'
      });
    }

    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return res.status(500).json({
        error: 'Authentication error',
        reply: 'Service configuration issue. Please contact support.'
      });
    }

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return res.status(504).json({
        error: 'Request timeout',
        reply: 'The request took too long. Please try a simpler question.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      reply: 'Sorry, I\'m experiencing technical difficulties. Please try again in a moment.'
    });
  }
});

// Catch-all route: serve index.html for SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════╗`);
  console.log(`║  Virtual Herbal Garden Backend Server         ║`);
  console.log(`║  Port: ${PORT.toString().padEnd(40)} ║`);
  console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(31)} ║`);
  console.log(`║  Domain: herbal-garden (restricted)            ║`);
  console.log(`╚════════════════════════════════════════════════╝`);
  console.log(`\n🌿 Server ready at http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
});
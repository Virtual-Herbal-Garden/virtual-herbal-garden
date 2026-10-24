// Virtual Herbal Garden - Backend API & Static Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../frontend');

// Middleware
app.use(cors());
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

// Optional MongoDB integration with safe fallback
let mongoose = null;
let isDbConnected = false;
try {
  mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => {
        isDbConnected = true;
        console.log('✅ Connected to MongoDB Database');
      })
      .catch(err => {
        console.warn('⚠️ MongoDB Connection unavailable. Falling back to in-memory store:', err.message);
      });
  }
} catch (e) {
  console.log('ℹ️ Running in lightweight mode without mongoose.');
}

// In-Memory Fallback Stores
const inMemoryStore = {
  contacts: [],
  quizResults: [],
  users: []
};

// Herbal Garden Specialized Chatbot Instruction
const HERBAL_GARDEN_SYSTEM_INSTRUCTION = `You are a specialized Virtual Herbal Garden Assistant. You ONLY answer questions related to:
- Herbs, medicinal plants, and garden plants
- Growing tips, cultivation methods, and plant care
- Soil types, sunlight requirements, watering schedules
- Fertilizers, composting, and organic gardening
- Medicinal properties and Ayurvedic uses of plants (Tulsi, Ashwagandha, Neem, Aloe Vera, Turmeric, Brahmi, etc.)
- Health benefits and traditional wellness
- Harvesting, preservation, and storage of herbs
- Natural remedies, herbal teas, and home remedies
- Plant identification and botanical taxonomy

STRICT RULES:
1. If asked about off-topic subjects (politics, movies, crypto, non-botanical topics), respond:
"I can only answer questions related to herbs, plants, and botanical gardening. Please ask me about medicinal plants, growing tips, or natural remedies!"
2. Always add a concise reminder that herbal information is for educational purposes.`;

// Plant taxonomy dataset
const plantsData = [
  { id: 'tulsi', name: 'Tulsi (Holy Basil)', botanical: 'Ocimum tenuiflorum', family: 'Lamiaceae', category: 'Adaptogen & Immunity', img: 'images/tulsi03.jpg', model: 'models/tulsi.glb', uses: 'Immunity booster, Respiratory health, Adaptogen, Stress reduction' },
  { id: 'aloevera', name: 'Aloe Vera (Ghritkumari)', botanical: 'Aloe barbadensis miller', family: 'Asphodelaceae', category: 'Dermal & Digestive', img: 'images/Aloe Vera.jpg', model: 'models/aloe_vera.glb', uses: 'Skin healing, Digestive health, Burn recovery, Epithelial soothing' },
  { id: 'ashwagandha', name: 'Ashwagandha (Indian Ginseng)', botanical: 'Withania somnifera', family: 'Solanaceae', category: 'Rasayana / Neuro-Endocrine', img: 'images/Ashwagandha.jpg', model: 'models/Ahwagandha.glb', uses: 'Cortisol modulation, Anxiety reduction, Physical stamina, Neuroprotection' },
  { id: 'bacopa', name: 'Brahmi (Water Hyssop)', botanical: 'Bacopa monnieri', family: 'Plantaginaceae', category: 'Medhya Rasayana / Nootropic', img: 'images/bacopa.jpg', model: 'models/bacopa_monnieri_plant.glb', uses: 'Memory booster, Synaptic facilitation, Anxiety relief, Cognitive vitality' },
  { id: 'turmeric', name: 'Turmeric (Haridra)', botanical: 'Curcuma longa', family: 'Zingiberaceae', category: 'Anti-Inflammatory', img: 'images/Turmeric plant.jpeg', model: 'models/Turmeric.glb', uses: 'Anti-inflammatory, NF-κB inhibition, COX-2 suppression, Wound healing' },
  { id: 'ginger', name: 'Ginger (Adrak / Shunthi)', botanical: 'Zingiber officinale', family: 'Zingiberaceae', category: 'Digestive & Carminative', img: 'images/Ginger.webp', model: null, uses: 'Nausea relief, Gastrointestinal motility, Carminative, Anti-emetic' },
  { id: 'clove', name: 'Clove (Lavanga)', botanical: 'Syzygium aromaticum', family: 'Myrtaceae', category: 'Analgesic & Dental', img: 'images/Clove.jpg', model: 'models/Clove.glb', uses: 'Dental analgesia, Local antiseptic, Antimicrobial, Digestive spice' },
  { id: 'cardamom', name: 'Cardamom (Elaichi)', botanical: 'Elettaria cardamomum', family: 'Zingiberaceae', category: 'Digestive & Aromatic', img: 'images/Cardamom.jpg', model: 'models/Cardamom.glb', uses: 'Digestive comfort, Oral halitosis prevention, Respiratory soothing' },
  { id: 'cinnamon', name: 'Cinnamon (Dalchini)', botanical: 'Cinnamomum verum', family: 'Lauraceae', category: 'Glycemic Modulator', img: 'images/Cinnamon.jpg', model: 'models/Cinnamon.glb', uses: 'Insulin mimetic, GLUT-4 activation, Cardioprotective, Antimicrobial' },
  { id: 'chamomile', name: 'Chamomile (Babuna)', botanical: 'Matricaria chamomilla', family: 'Asteraceae', category: 'Sedative & Sleep Aid', img: 'images/chamomile.jpg', model: 'models/chamomile.glb', uses: 'Sleep aid, GABA-A receptor modulation, Digestive soothing, Mild sedative' },
  { id: 'barberry', name: 'Barberry (Daruharidra)', botanical: 'Berberis vulgaris', family: 'Berberidaceae', category: 'Hepatobiliary Tonic', img: 'images/berberry.jpg', model: 'models/barberry_plant_in_pot.glb', uses: 'AMPK activation, Glucose balance, Liver support, Microbial defense' },
  { id: 'kalnchoe', name: 'Pashanbheda / Miracle Leaf', botanical: 'Kalanchoe pinnata', family: 'Crassulaceae', category: 'Lithotriptic / Kidney Health', img: 'images/kala.jpg', model: 'models/kalanchoe_calandiva.glb', uses: 'Kidney stone dissolution, Calcium oxalate inhibition, Wound healing' },
  { id: 'saffron', name: 'Saffron (Kesar / Kumkuma)', botanical: 'Crocus sativus', family: 'Iridaceae', category: 'Neuroprotective & Mood', img: 'images/saffron.jpg', model: null, uses: 'Mood enhancement, Serotonin reuptake support, Retinal health, Antioxidant' }
];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Virtual Herbal Garden API',
    database: isDbConnected ? 'MongoDB Connected' : 'In-Memory Store Active',
    specimens: plantsData.length,
    models3D: plantsData.filter(p => p.model !== null).length,
    timestamp: new Date().toISOString()
  });
});

// 2. Plants taxonomy dataset
app.get('/api/plants', (req, res) => {
  res.json({ success: true, count: plantsData.length, data: plantsData });
});

// 3. Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }
    const record = { id: Date.now(), name, email, subject, message, receivedAt: new Date() };
    inMemoryStore.contacts.push(record);
    res.status(201).json({ success: true, message: 'Message dispatched successfully to academic team!', id: record.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Quiz Results Submission
app.post('/api/quiz/submit', (req, res) => {
  try {
    const { username, score, total, category } = req.body;
    const record = { id: Date.now(), username: username || 'Guest', score, total, category, completedAt: new Date() };
    inMemoryStore.quizResults.push(record);
    res.status(201).json({ success: true, message: 'Quiz score recorded successfully!', record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ success: false, message: 'Username and email required' });
  }
  inMemoryStore.users.push({ username, email, registeredAt: new Date() });
  res.status(201).json({ success: true, message: 'User registered successfully!' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, email } = req.body;
  res.json({ success: true, message: 'Login successful', user: { username: username || 'GardenScholar', email: email || 'user@example.com' } });
});

// 6. Gemini AI Chatbot Proxy Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const prompt = (req.body.prompt || '').trim();
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check for off-topic queries
    const offTopicKeywords = ['politics', 'election', 'movie', 'football', 'cricket', 'bitcoin', 'crypto', 'stock'];
    const lower = prompt.toLowerCase();
    if (offTopicKeywords.some(kw => lower.includes(kw) && !lower.includes('plant') && !lower.includes('herb'))) {
      return res.json({
        reply: "I can only answer questions related to herbs, medicinal plants, and gardening. Please ask me about Ayurvedic flora, cultivation, or therapeutic benefits!"
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.GENERATIVE_API_KEY || process.env.GOOGLE_API_KEY;

    if (API_KEY) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const body = {
          systemInstruction: { parts: [{ text: HERBAL_GARDEN_SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.json({ reply: replyText, candidates: data.candidates });
          }
        }
      } catch (externalErr) {
        console.warn('Gemini API call failed, using botanical fallback engine:', externalErr.message);
      }
    }

    // High-quality botanical knowledge fallback
    const matched = plantsData.find(p => lower.includes(p.name.toLowerCase().split(' ')[0]) || lower.includes(p.id));
    if (matched) {
      return res.json({
        reply: `**${matched.name}** (*${matched.botanical}*), Family: ${matched.family}.\n\n` +
          `• **Primary Action**: ${matched.category}\n` +
          `• **Therapeutic Uses**: ${matched.uses}\n\n` +
          `You can view the full profile in the library or inspect its 3D specimen in the 3D garden space! (For educational purposes).`
      });
    }

    return res.json({
      reply: "In our Virtual Herbal Garden, we specialize in Ayurvedic medicinal plants including Tulsi, Ashwagandha, Aloe Vera, Brahmi, Turmeric, Clove, Cardamom, Cinnamon, Chamomile, Barberry, and Pashanbheda. Please ask about any plant's cultivation, phytochemical properties, or therapeutic uses!"
    });

  } catch (err) {
    console.error('Chatbot route error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// Fallback for root single-page navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Server listen
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌿 Virtual Herbal Garden Server running on http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌱 Botanical Data: http://localhost:${PORT}/api/plants`);
  });
}

module.exports = app;

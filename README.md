# 🌿 Virtual Herbal Garden

An interactive botanical educational platform and 3D virtual identification repository for regional Ayurvedic and medicinal flora. Developed as a Bachelor of Engineering Third Year Minor Project in the Department of Computer Engineering at **SSBT's College of Engineering & Technology, Bambhori, Jalgaon**, affiliated with **Kavayitri Bahinabai Chaudhari North Maharashtra University**.

---

## 🌟 Key Features

- **Interactive 3D Botanical Space**: Inspect 11 genuine 3D plant specimens (`.glb`) with 360-degree orbit rotation, camera zoom, auto-rotation, and full taxonomic data cards.
- **3D Ecosystem Landscape**: Experience an interactive procedural garden landscape rendered in real-time WebGL via Three.js.
- **Categorized Botanical Library**: 13 digitized medicinal flora classified by therapeutic energetics (Adaptogens, Dermal Healing, Anti-Inflammatory, Glycemic Modulators, Nootropics, Sedatives, Lithotriptics).
- **Phytochemical & Pharmacological Profiles**: High-fidelity monographs covering botanical taxonomy, active constituents (Eugenol, Withanolides, Curcumin, Bacosides, Berberine, etc.), clinical applications, and safety precautions.
- **Herbal Garden Assistant (AI Chatbot)**: Domain-restricted assistant answering gardening, cultivation, and Ayurvedic plant questions using Google Gemini AI with localized fallback.
- **Interactive Botanical Quiz**: Test knowledge on medicinal flora, active phytochemicals, and therapeutic applications with instant scoring.
- **Expert Consultation Network**: Guidance on organic pest management, herbal garden layout, and soil health.
- **Offline & Zero-Config Ready**: Runs completely without complex cloud setup using an in-memory datastore, with optional MongoDB Atlas persistence.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Botanical Design System), JavaScript (ES6+)
- **3D Rendering & WebGL**: Google `<model-viewer>` (GLB viewer with PBR lighting), Three.js (r128)
- **Backend API**: Node.js, Express 4, CORS, Dotenv
- **Serverless Integration**: Netlify Functions (`@google/generative-ai`)
- **Database (Optional)**: MongoDB / Mongoose (with automated in-memory fallback)
- **Testing**: Native Node.js Test Runner, Static Asset Integrity Suite, Browser Automation

---

## 📂 Repository Structure

```text
virtual-herbal-garden/
├── code/
│   ├── frontend/                 # Core web application
│   │   ├── index.html            # Main landing page with hero & plant cards
│   │   ├── dashboard.html        # Botanical catalog with live search filter
│   │   ├── css/                  # Curated botanical CSS stylesheets
│   │   ├── html/                 # 3D Garden, Categories, Quizzes, About, Contact
│   │   ├── plants_html/          # 13 detailed individual plant monographs
│   │   ├── images/               # High-resolution botanical photography & icons
│   │   ├── models/               # Runtime 3D plant models (.glb)
│   │   ├── videos/               # Runtime habitat video background (.mp4)
│   │   └── experts/              # Agronomy & cultivation guidance pages
│   ├── backend/                  # Node.js Express server
│   │   ├── index.js              # API routes (/api/health, /api/plants, /api/generate)
│   │   ├── package.json          # Backend dependencies (express, cors, dotenv)
│   │   └── test.js               # Backend API endpoint test suite
│   └── netlify/
│       └── functions/
│           └── chatbot.js        # Serverless Gemini AI chatbot function
├── docs/                         # Academic documentation & audit reports
│   ├── INITIAL_PROJECT_AUDIT.md  # Comprehensive project and Git audit
│   ├── ASSET_RECOVERY_REPORT.md  # 3D models and media recovery report
│   ├── TEST_REPORT.md            # Static, backend, and browser test results
│   ├── CHANGELOG.md              # Historical ledger of changes and repairs
│   ├── Virtual_Herbal_Garden_Final_Project_Report_43p.pdf   # 43-page academic report
│   └── 2025-03-28_Virtual_Herbal_Garden_Project_Presentation_22p.pdf # Presentation slides
├── imp_assests/                  # Canonical collection of verified project assets
│   ├── models/                   # 11 verified genuine 3D plant specimens (.glb)
│   ├── videos/                   # Verified background video (bg-video.mp4)
│   └── images/                   # Canonical plant photography and iconography
├── delete_folder/                # Quarantine directory (Non-destructive retention)
│   ├── README.md                 # Quarantine policy notice
│   └── QUARANTINE_MANIFEST.md   # Inventory of legacy & recovered stubs
├── scripts/
│   └── test-runner.js            # Automated verification test suite (46 tests)
├── index.html                    # Root entry redirect to code/frontend/index.html
├── package.json                  # Root project scripts and configuration
├── .gitignore                    # Comprehensive secrets & cache protection
└── .env.example                  # Environment configuration template
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended, tested on v24.18.1)
- Modern web browser with WebGL enabled (Chrome, Edge, Firefox, Safari)

### Quick Start (Frontend Only)

The frontend is a modern static web application. You can launch it directly without starting a server:
1. Double-click `code/frontend/index.html` (or the root `index.html`) in your file explorer.
2. The site will open in your default browser with complete styling, navigation, 3D model viewer, and offline botanical knowledge engine.

### Full-Stack Mode (Node.js Express Backend)

To enable live API endpoints, contact submissions, and Gemini AI proxy:

```bash
# 1. Install backend dependencies
cd code/backend
npm install
cd ../..

# 2. (Optional) Configure environment variables
# Copy .env.example to code/backend/.env and add your GEMINI_API_KEY if desired
cp .env.example code/backend/.env

# 3. Start the application
npm start
```

The server will initialize at **http://localhost:3000**:
- 🌐 Frontend Portal: `http://localhost:3000/`
- 💚 Health Check: `http://localhost:3000/api/health`
- 🌱 Botanical Data API: `http://localhost:3000/api/plants`

---

## 🧪 Testing

The repository includes a comprehensive 46-point verification test suite covering directory structure, GLB header validity, video container signatures, secret scanning, and backend API endpoints:

```bash
# Run complete verification test suite
npm test

# Run backend API tests only
npm run test:backend
```

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `code/backend/.env`:

| Variable | Description | Required? |
|---|---|---|
| `PORT` | Local server port (Default: `3000`) | Optional |
| `NODE_ENV` | Environment mode (`development` or `production`) | Optional |
| `GEMINI_API_KEY` | Google Gemini API key for live AI chatbot responses | Optional (bot utilizes localized botanical knowledge engine if omitted) |
| `MONGODB_URI` | MongoDB Atlas connection string | Optional (uses structured in-memory store if omitted) |

---

## 🌿 Digitized Medicinal Plant Catalog

| Specimen Name | Botanical Name | Family | Therapeutic Category | 3D Model |
|---|---|---|---|---|
| **Tulsi (Holy Basil)** | *Ocimum tenuiflorum* | Lamiaceae | Adaptogen & Immunity | ✅ `models/tulsi.glb` |
| **Aloe Vera (Ghritkumari)** | *Aloe barbadensis miller* | Asphodelaceae | Dermal & Digestive | ✅ `models/aloe_vera.glb` |
| **Ashwagandha** | *Withania somnifera* | Solanaceae | Rasayana / Neuro-Endocrine | ✅ `models/Ahwagandha.glb` |
| **Brahmi (Water Hyssop)** | *Bacopa monnieri* | Plantaginaceae | Medhya Rasayana / Nootropic | ✅ `models/bacopa_monnieri_plant.glb` |
| **Turmeric (Haridra)** | *Curcuma longa* | Zingiberaceae | Anti-Inflammatory | ✅ `models/Turmeric.glb` |
| **Ginger (Adrak)** | *Zingiber officinale* | Zingiberaceae | Digestive & Carminative | 📷 High-Res Photography |
| **Clove (Lavanga)** | *Syzygium aromaticum* | Myrtaceae | Analgesic & Dental | ✅ `models/Clove.glb` |
| **Cardamom (Elaichi)** | *Elettaria cardamomum* | Zingiberaceae | Digestive & Aromatic | ✅ `models/Cardamom.glb` |
| **Cinnamon (Dalchini)** | *Cinnamomum verum* | Lauraceae | Glycemic Modulator | ✅ `models/Cinnamon.glb` |
| **Chamomile (Babuna)** | *Matricaria chamomilla* | Asteraceae | Sedative & Sleep Aid | ✅ `models/chamomile.glb` |
| **Barberry (Daruharidra)**| *Berberis vulgaris* | Berberidaceae | Hepatobiliary Tonic | ✅ `models/barberry_plant_in_pot.glb` |
| **Pashanbheda** | *Kalanchoe pinnata* | Crassulaceae | Lithotriptic / Kidney Health | ✅ `models/kalanchoe_calandiva.glb` |
| **Saffron (Kesar)** | *Crocus sativus* | Iridaceae | Neuroprotective & Mood | 📷 High-Res Photography |

---

## ☁️ Deployment

### Netlify Deployment
1. Set the publish directory to `code/frontend`.
2. Set functions directory to `code/netlify/functions`.
3. In Netlify Site Settings > Environment Variables, add `GEMINI_API_KEY` if desired.

### Traditional VPS / Render / Heroku
Run `npm start` at root or `node code/backend/index.js`. The Express server automatically serves the frontend static assets and handles all API routes.

---

## ⚠️ Academic & Educational Disclaimer

The botanical classifications, Ayurvedic energetics (Rasa, Virya, Vipaka), and pharmacological data provided in this project are curated strictly for **academic, educational, and research purposes**. They do not constitute medical advice or diagnosis. Always consult a qualified medical professional before therapeutic use of any herbal specimen.

---

## 👥 Academic Project Team

- **Department**: Department of Computer Engineering, SSBT's College of Engineering & Technology, Bambhori, Jalgaon
- **Affiliation**: Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon
- **Project Team**:
  - Rohan A. Baviskar (Lead Developer & Systems Architect)
  - Ujjwal P. Patil (Full-Stack & 3D Interactive Engineer)
  - Kunal D. Walhe (Taxonomy & Data Integration Engineer)
  - Tejas B. Sapkale (Quality Assurance & Documentation)
- **Faculty Guide**: Dr. Surendra Ramteke (Associate Professor)
- **Head of Department**: Dr. Manoj E. Patil
- **Principal**: Dr. Girish K. Patnaik

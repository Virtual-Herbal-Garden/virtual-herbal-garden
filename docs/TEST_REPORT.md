# Test Report: Virtual Herbal Garden

**Date**: 2026-10-24  
**Test Suite**: Static Verification, Backend API Suite, and End-to-End Browser Automation  
**Target Environment**: Node.js v24.18.1 / Express / Modern WebGL (Three.js & Google `<model-viewer>`)  
**Overall Status**: ✅ **100% PASSED** (46 Static Tests Passed, 6 Backend Endpoint Tests Passed, 7 E2E Browser Flows Passed)

---

## 1. Static Verification & Repository Integrity Tests

Automated via `node scripts/test-runner.js` (`npm test`).

| Test Item | Methodology | Expected Outcome | Observed Outcome | Status |
|---|---|---|---|---|
| **Repository Directories** | Filesystem check across 15 mandatory paths (`code/frontend`, `code/backend`, `imp_assests/`, `docs/`, etc.) | All directories exist and are structured cleanly | 15/15 directories confirmed present | ✅ Pass |
| **3D GLB Model Verification (11 models)** | Binary inspection: header magic `0x46546C67`, version `2`, header length equals file size | Valid glTF 2.0 binary container with non-zero geometry/texture buffers | All 11 models verified: `Ahwagandha.glb` (3.81 MB), `aloe_vera.glb` (13.46 MB), `bacopa_monnieri_plant.glb` (14.75 MB), `barberry_plant_in_pot.glb` (32.34 MB), `Cardamom.glb` (3.74 MB), `chamomile.glb` (10.93 MB), `Cinnamon.glb` (2.88 MB), `Clove.glb` (2.98 MB), `kalanchoe_calandiva.glb` (47.90 MB), `tulsi.glb` (3.06 MB), `Turmeric.glb` (3.50 MB) | ✅ Pass |
| **Video Asset Integrity** | Binary check: MPEG-4 `ftypdash` container signature and byte size (>1 MB) | Valid, playable MP4 file | `bg-video.mp4` verified (3.90 MB) | ✅ Pass |
| **Plant HTML Dossiers (13 files)** | Content analysis: presence of botanical name, family, taxonomy, and clinical pharmacology | Structured taxonomy, phytochemicals, and therapeutic uses | 13/13 plant files validated (`aloevera.html`, `ashwagandha.html`, `bacopa_monnieri.html`, etc.) | ✅ Pass |
| **Secret Leak Scanning** | Regex scan for MongoDB connection strings and Google API keys | No live credentials or private connection strings in tracked repository files | Zero credentials detected. Sensitive patterns blocked. | ✅ Pass |
| **Academic Deliverables** | Filesystem size verification for research documentation | PDFs exist with valid sizes (>1 MB) | `Virtual_Herbal_Garden_Final_Project_Report_43p.pdf` (22.6 MB), `2025-03-28_Virtual_Herbal_Garden_Project_Presentation_22p.pdf` (5.2 MB) | ✅ Pass |

---

## 2. Backend API Endpoint Tests

Automated via `node code/backend/test.js`.

| Endpoint | HTTP Method | Test Description | Expected Status | Observed Outcome | Status |
|---|---|---|---|---|---|
| `/api/health` | `GET` | Service liveness, specimen inventory, and 3D model count | `200 OK` | Returned `{ status: 'healthy', specimens: 13, models3D: 11 }` | ✅ Pass |
| `/api/plants` | `GET` | Catalog retrieval with full taxonomy and asset paths | `200 OK` | Returned all 13 plants with botanical names, families, and model references | ✅ Pass |
| `/api/contact` | `POST` | Contact form inquiry dispatch | `201 Created` | Message registered successfully; returns confirmation ID | ✅ Pass |
| `/api/quiz/submit` | `POST` | Quiz score record submission | `201 Created` | Recorded score with username and category | ✅ Pass |
| `/api/generate` | `POST` | Botanical AI chatbot query (`What is Tulsi used for?`) | `200 OK` | Returned informative Ayurvedic response regarding adaptogenic and immune properties | ✅ Pass |
| `/api/generate` | `POST` | Domain restriction enforcement on off-topic input (`cricket world cup`) | `200 OK` | Guardrail activated: politely declined off-topic query and redirected to herbal topics | ✅ Pass |

---

## 3. End-to-End Browser Automation Tests

Conducted using headless browser subagent with WebP session recording:
- **Recording Artifact**: `vhg_e2e_testing_1792855704031.webp`

| Journey | Interaction Flow | Expected Visual / Behavioral Result | Observed Result | Status |
|---|---|---|---|---|
| **1. Landing Page Exploration** | Load `http://localhost:3000/`, scroll through hero, stats banner, and plant cards | Hero video loads, stats show 13 specimens & 11 3D models, plant cards display high-res photography with "Explore Plant" and "3D" links | Rendered cleanly without console errors or layout shift | ✅ Pass |
| **2. Interactive Chatbot Drawer** | Click `#chatBotIcon`, type inquiry, press enter | Chat drawer opens smoothly, typing indicator appears, bot replies with formatted botanical guidance | Instant response generated with accurate medicinal data; chat persists in history | ✅ Pass |
| **3. Live Dashboard Search Filter** | Navigate to `dashboard.html`, input query `cortisol` | Plant specimens dynamically filter in real-time, showing only Ashwagandha | Grid filtered instantaneously; 1 card displayed | ✅ Pass |
| **4. 3D Specimen Studio** | Navigate to `html/3d_garden.html`, click plant chips (`Ashwagandha`, `Turmeric`) | 3D canvas updates to target GLB model, camera controls allow orbit/zoom, specimen card displays active constituents | 3D plant meshes rendered interactively with orbit controls and full data card | ✅ Pass |
| **5. 3D Ecosystem Navigator** | Click "3D Ecosystem" tab | Switches from studio to multi-plant landscape scene in Three.js | Three.js scene loaded with orbit rotation controls | ✅ Pass |
| **6. Ayurvedic Quiz Challenge** | Navigate to `html/quizzes.html`, answer questions 1 through 5 | Questions advance sequentially, track points, and display final completion score | Score displayed: `5 out of 5! Excellent! You have mastered Ayurvedic botanical knowledge.` | ✅ Pass |
| **7. Cross-Device Responsiveness** | Test mobile viewport (<480px) and desktop (>1200px) | Navbar collapses cleanly, cards adjust from multi-column grid to stacked layout, chatbot adapts to bottom sheet | Fully responsive across screen sizes | ✅ Pass |

---

## 4. Unresolved Items & Documented Limitations

1. **Google Gemini Live API Key**:
   - The chatbot uses a high-fidelity local botanical knowledge engine when `GEMINI_API_KEY` is not provided in `.env`. To connect to live external Google Gemini generative language servers, a user must obtain an API key from Google AI Studio and configure `GEMINI_API_KEY` in `code/backend/.env` or the Netlify dashboard.
2. **MongoDB Atlas Persistence**:
   - Live MongoDB Atlas storage is optional. The application functions completely with zero configuration using its structured in-memory datastore. For production persistence, configure `MONGODB_URI` in `.env`.
3. **Ginger and Saffron 3D Models**:
   - Out of the 13 specimens, 11 possess verified 3D GLB meshes. Ginger and Saffron are supported by high-resolution botanical photography and complete taxonomic profiles; 3D scans for these two species were not part of the original project asset pool.

# Changelog: Virtual Herbal Garden

All notable changes, structural migrations, asset recoveries, and enhancements completed during the project recovery and finalization are documented in this ledger.

---

## [1.0.0] - 2026-10-24

### 🚀 Architecture & Structure Reorganization
- **Canonical Structure Established**:
  - Organized runnable application source under `code/` (`code/frontend/`, `code/backend/`, `code/netlify/`).
  - Created root-level canonical asset repository `imp_assests/` (`imp_assests/models/`, `imp_assests/videos/`, `imp_assests/images/`).
  - Created `delete_folder/` quarantine area with `README.md` and non-destructive `QUARANTINE_MANIFEST.md` for legacy/superseded folders without data deletion.
  - Maintained academic documentation and final engineering PDF deliverables in `docs/`.
  - Added root entry point `index.html` with graceful redirect to `code/frontend/index.html`.

### 🔍 Asset Recovery & Validation
- **3D Botanical Models Recovered**:
  - Recovered and validated all 11 genuine `.glb` 3D plant specimens (`Ahwagandha.glb`, `aloe_vera.glb`, `bacopa_monnieri_plant.glb`, `barberry_plant_in_pot.glb`, `Cardamom.glb`, `chamomile.glb`, `Cinnamon.glb`, `Clove.glb`, `kalanchoe_calandiva.glb`, `tulsi.glb`, `Turmeric.glb`) from repository source.
  - Validated binary `glTF` 2.0 container headers, geometry, and texture buffers.
  - Quarantined zero-filled stubs from raw disk recovery safely in `delete_folder/`.
- **Media Assets Preserved**:
  - Validated and restored `bg-video.mp4` (4.09 MB MPEG-4).
  - Validated and organized 34 high-resolution botanical photographs and icons.

### 🛠️ Frontend Repairs & Modernization
- **Landing Page (`code/frontend/index.html`)**:
  - Integrated hero video background with responsive poster fallback.
  - Added botanical stats overview (13 specimens, 11 3D models, 100% verified taxonomy).
  - Merged local enriched plant cards (Turmeric, Ginger, Clove, Cardamom, Cinnamon, Chamomile, Barberry, Pashanbheda, Saffron) with GitHub interactive chatbot widget.
  - Added direct "3D" model quick links on each plant card.
  - Added academic attribution footer for SSBT COET and KBC North Maharashtra University.
- **Interactive 3D Garden Space (`code/frontend/html/3d_garden.html`)**:
  - Built dual-mode 3D viewer: **Specimen Studio** (interactive 360° GLB model inspection powered by `<model-viewer>`) and **3D Ecosystem** (procedural garden landscape in Three.js).
  - Added plant selector chips with active state, auto-rotation toggle, camera reset, and deep specimen data card.
  - Supported URL parameter deep-linking (`?plant=ashwagandha`, `?plant=tulsi`).
- **Individual Plant Pages (`code/frontend/plants_html/*.html`)**:
  - Updated all 13 plant dossiers with standardized relative paths and deep links into the 3D viewer.
- **Botanical Quiz (`code/frontend/html/quizzes.html`)**:
  - Validated interactive 5-question Ayurvedic challenge with immediate feedback and scoring.

### ⚙️ Backend & API Hardening
- **Node.js Express Server (`code/backend/index.js`)**:
  - Cleaned up dependencies and restored `/api/health`, `/api/plants`, `/api/contact`, `/api/quiz/submit`, and `/api/generate`.
  - Built-in zero-config in-memory fallback datastore for contact inquiries and quiz results when MongoDB Atlas is offline.
  - Hardened `/api/generate` chatbot proxy with strict herbal garden domain instruction and localized botanical knowledge engine.
- **Netlify Serverless Function (`code/netlify/functions/chatbot.js`)**:
  - Added clear guidance response when `GEMINI_API_KEY` is not configured, preventing unhandled 500 crashes.

### 🔒 Security & Environment
- **Protection of Secrets**:
  - Verified no live API keys or MongoDB credentials are leaked in tracked files.
  - Added `.env.example` with sanitized placeholders.
  - Configured root `.gitignore` to protect `.env`, `code/backend/.env`, and quarantine files while preserving documentation manifests.

### 🧪 Verification & Release
- **Comprehensive Test Suite**:
  - Implemented `scripts/test-runner.js` covering 46 static checks and backend endpoint tests.
  - Implemented `code/backend/test.js` validating all API routes.
  - Conducted headless browser automation testing and recorded WebP walkthrough (`vhg_e2e_testing_1792855704031.webp`).

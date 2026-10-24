# Initial Project Audit: Virtual Herbal Garden

**Date**: 2026-10-24  
**Auditor**: Senior Full-Stack Developer & Repository Recovery Engineer  
**Project**: Virtual Herbal Garden  
**Target Repository**: `https://github.com/Virtual-Herbal-Garden/virtual-herbal-garden.git`  
**Workspace Root**: `d:\Ujjwal\01_Work\Main_Projects\virtual-herbal-garden`  

---

## 1. Executive Summary

The Virtual Herbal Garden is an educational and botanical web platform designed to provide comprehensive taxonomy, medicinal benefits, and interactive 3D virtual exploration of Indian Ayurvedic and medicinal plants. The project was initially developed as a Third-Year Computer Engineering Minor Project at SSBT's College of Engineering & Technology, Bambhori, Jalgaon (affiliated with Kavayitri Bahinabai Chaudhari North Maharashtra University).

This audit established the true project state across local workspace storage, external recovery locations on drive `D:\`, and the official GitHub repository `Virtual-Herbal-Garden/virtual-herbal-garden`.

---

## 2. Source of Truth & Repository Analysis

### 2.1 Git Remote & Branches
- **Remote URL**: `https://github.com/Virtual-Herbal-Garden/virtual-herbal-garden.git`
- **Active / Default Branch**: `main`
- **Latest Remote Commit**: `9dad73d544ac9097c90db0d2ac7c8e71efa50de1` (`fix: Chatbot`, authored by `UjjwalPatil01`)
- **Remote Structure**: 98 files, including root `index.html`, `dashboard.html`, `html/`, `css/`, `images/`, `plants_html/`, `models/`, `videos/`, `Backend/`, and `netlify/functions/chatbot.js`.

### 2.2 Local Workspace Discovery
The local folder `D:\Ujjwal\01_Work\Main_Projects\virtual-herbal-garden` contained:
1. `README.md` (A high-level project summary)
2. `docs/`:
   - `Virtual_Herbal_Garden_Final_Project_Report_43p.pdf` (23.18 MB academic report)
   - `2025-03-28_Virtual_Herbal_Garden_Project_Presentation_22p.pdf` (5.36 MB presentation)
3. `Web App Final/`:
   - 80 files containing HTML pages, CSS stylesheets, images, `Backend/` directory, and `experts/` sub-site.
   - **Crucial gap**: The 11 GLB 3D models (`models/`) and the background video (`videos/bg-video.mp4`) were absent from this local subfolder.
   - **Local Modifications**: `index.html` contained enriched plant cards (Turmeric, Ginger, Clove, Cardamom, Cinnamon, Chamomile, Barberry, Pashanbheda, Saffron) and an SSBT COET footer, while missing the floating chatbot widget present in GitHub's version.

---

## 3. Drive D Asset Recovery & Integrity Audit

A comprehensive search of `D:\` was executed to find original and recovered assets:

| Location | Contents | Integrity Analysis | Recovery Decision |
|---|---|---|---|
| `D:\delete_folder\damaged_herbal_models_and_videos\models\` | 11 `.glb` plant models (`Ahwagandha.glb`, `aloe_vera.glb`, etc.) | **DAMAGED / ZERO-FILLED**: Binary inspection revealed all files are 100% null bytes (`0x00`), lacking the `glTF` header magic. | Quarantined in `delete_folder/` as recovery stubs. |
| `D:\delete_folder\damaged_herbal_models_and_videos\videos\` | `bg-video.mp4` (4.09 MB) | **DAMAGED / ZERO-FILLED**: Zero bytes throughout. | Quarantined in `delete_folder/`. |
| `D:\delete_folder\damaged_college_undeleted_stubs\03_Minor_Project_Virtual_Herbal_Garden\` | `Virtual_Herbal_Garden_Web_Application_Source_Code.zip` (112 MB) & `Virtual_Herbal_Garden_LaTeX_Report_Source_Backup.zip` (21 MB) | **CORRUPTED ZIP**: Central directory record missing / truncated stream. | Quarantined in `delete_folder/`. |
| `GitHub Remote Repository (HEAD: 9dad73d)` | 11 `.glb` models & `videos/bg-video.mp4` | **100% GENUINE & VALID**: `glTF` magic `0x46546C67`, version 2, valid buffer length, full textures and geometry intact. `bg-video.mp4` has valid `ftypdash` container. | **Restored as canonical runtime assets** into `imp_assests/` and runtime paths. |
| `D:\Ujjwal\03_College\03_Minor_Project_Virtual_Herbal_Garden` | PDFs, Codebase reference documentation | **VALID**: Confirms authors, academic affiliation, and documentation context. | Preserved. |

---

## 4. Architectural & Component Audit

### 4.1 Frontend Architecture
- **Pages**:
  - `index.html`: Main landing page with hero, search, features, interactive cards, and chatbot.
  - `dashboard.html`: Analytics dashboard with botanical metrics and categories.
  - `html/3d_garden.html`: Interactive 3D plant viewer utilizing Three.js and GLTFLoader.
  - `html/categories.html`: Plant categorization (Ayurvedic, Medicinal, Aromatic, Succulents).
  - `html/quizzes.html`: Educational plant identification quizzes.
  - `html/experts.html` & `experts/`: Consultation guidance pages for cultivation, pest management, and soil guidance.
  - `html/about.html`, `html/contact.html`, `html/signup.html`, `html/get_started.html`.
  - `plants_html/`: 13 detailed individual plant profile pages (Aloevera, Ashwagandha, Bacopa Monnieri, Barberry, Cardamom, Chamomile, Cinnamon, Clove, Ginger, Kalanchoe, Saffron, Tulsi, Turmeric).

### 4.2 Backend & Serverless API
- **Node.js Express Server (`Backend/index.js`)**:
  - Configured with CORS, static file serving, and `/api/health`.
  - Features `/api/generate` proxying prompts to Google Gemini generative AI with botanical system prompt restrictions.
  - Local copy had experimental Mongoose models without an active DB or credentials, breaking the chatbot proxy.
- **Netlify Serverless Function (`netlify/functions/chatbot.js`)**:
  - Serverless implementation using `@google/generative-ai` with strict domain instructions.
  - Graceful fallback for missing API keys or network degradation.

### 4.3 Missing Dependencies & Config
- Root `package.json` had placeholder test script (`exit 1`).
- `.env.example` needed documentation for `GEMINI_API_KEY` and optional server settings.
- `.gitignore` required safeguarding private `.env` files and quarantine directories while tracking assets.

---

## 5. Proposed Action & Repair Plan

1. **Pre-Restructure Backup**: Safeguard original local files in `D:\Ujjwal\01_Work\Project_Backups\` (Completed).
2. **Repository Attachment**: Connect git history from GitHub `main` (`9dad73d`) and create repair branch `repair/virtual-herbal-garden-finalization`.
3. **Directory Organization**:
   - `code/frontend/`: Static frontend pages, CSS, JS, and runtime assets.
   - `code/backend/`: Node.js Express server.
   - `code/netlify/`: Netlify functions.
   - `docs/`: Academic reports and complete markdown audit, recovery, and test reports.
   - `imp_assests/`: Canonical repository of verified 3D models (`models/`), videos (`videos/`), and images (`images/`).
   - `delete_folder/`: Quarantined recovery stubs and corrupted files with a non-destructive manifest.
4. **Code Merging & Repairs**:
   - Merge local enriched plant cards and SSBT COET footer into `index.html` alongside the chatbot widget.
   - Standardize `Backend/index.js` to provide reliable `/api/health`, `/api/generate`, `/api/plants`, and contact handling with in-memory/graceful fallback.
   - Ensure `3d_garden.html` Three.js loader points to valid models with interactive selector and error fallback.
   - Fix broken relative links across `plants_html/`, `experts/`, and `html/`.
5. **Testing & Verification**:
   - Run Node.js backend tests and API health checks.
   - Test frontend in automated browser: verify landing page, 3D model loader, navigation, plant pages, quizzes, and forms.
   - Produce comprehensive `docs/TEST_REPORT.md` and `docs/ASSET_RECOVERY_REPORT.md`.
6. **Git Release**: Stage sanitized files, commit on `repair/virtual-herbal-garden-finalization`, and push to remote.

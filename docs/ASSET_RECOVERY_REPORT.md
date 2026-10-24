# Asset Recovery Report: Virtual Herbal Garden

**Date**: 2026-10-24  
**Project**: Virtual Herbal Garden  
**Canonical Asset Directory**: `imp_assests/`  
**Runtime Asset Directories**: `code/frontend/models/`, `code/frontend/videos/`, `code/frontend/images/`  

---

## 1. Overview & Search Methodology

To ensure maximum fidelity and historical accuracy, an exhaustive multi-signal search was performed across local drives, recovery caches (`delete_folder`), and the official GitHub repository (`Virtual-Herbal-Garden/virtual-herbal-garden`).

Asset detection was carried out using:
- Magic byte validation (`glTF` container verification, `ftypdash` video container headers)
- SHA-256 cryptographic hashing
- Dimension and format checks for images (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`)
- Archive structural integrity testing (`ZipFile.OpenRead`)

---

## 2. Recovery Findings by Category

### 2.1 3D Plant Models (`.glb`)
All 11 target 3D models were audited. Files discovered in the local raw disk recovery folder (`D:\delete_folder\damaged_herbal_models_and_videos\models\`) were analyzed and found to consist exclusively of zero-byte / sparse null allocations resulting from disk carving failures.

In contrast, the assets in the official GitHub repository (`origin/main`) were validated and verified to possess valid `glTF` 2.0 binary headers, intact texture buffers, and complete geometric meshes.

| Plant Name | Model Filename | File Size | Header Magic | Status | Destination Path |
|---|---|---|---|---|---|
| Ashwagandha | `Ahwagandha.glb` | 3,998,180 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Aloe Vera | `aloe_vera.glb` | 14,115,516 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Brahmi | `bacopa_monnieri_plant.glb` | 15,462,040 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Barberry | `barberry_plant_in_pot.glb` | 33,906,928 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Cardamom | `Cardamom.glb` | 3,918,168 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Chamomile | `chamomile.glb` | 11,459,984 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Cinnamon | `Cinnamon.glb` | 3,024,236 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Clove | `Clove.glb` | 3,128,884 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Kalanchoe / Pashanbheda | `kalanchoe_calandiva.glb` | 50,222,944 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Tulsi (Holy Basil) | `tulsi.glb` | 3,207,448 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |
| Turmeric | `Turmeric.glb` | 3,669,924 bytes | `glTF` (v2) | **Verified Genuine** | `imp_assests/models/`, `code/frontend/models/` |

**Total 3D Models Recovered**: 11 of 11 (100% complete).

---

### 2.2 Video Assets (`.mp4`)
- **File**: `bg-video.mp4`
- **Size**: 4,092,291 bytes (4.09 MB)
- **Container**: MPEG-4 base media / ISO Media (ftypdash)
- **Evaluation**: The version in `D:\delete_folder\` was zero-byte corrupted; the verified genuine version from GitHub was recovered and placed in:
  - `imp_assests/videos/bg-video.mp4` (Canonical storage)
  - `code/frontend/videos/bg-video.mp4` (Runtime video background)

---

### 2.3 Botanical Image Assets
A collection of 34 high-resolution botanical photographs, background textures, and branding icons were audited. All image files were confirmed readable, non-corrupted, and preserved in:
- `imp_assests/images/` (Canonical preservation)
- `code/frontend/images/` (Runtime access)

Key plant images verified:
- `Aloe Vera.jpg`, `Ashwagandha.jpg`, `Ashwagandha1.jpeg`
- `bacopa.jpg`, `berberry.jpg`, `Cardamom.jpg`, `cardamom flower.jpeg`, `cardamom plant.jpeg`
- `chamomile.jpg`, `Cinnamon.jpg`, `Cinnamon Bush.jpeg`
- `Clove.jpg`, `Ginger.webp`, `kala.jpg` (Pashanbheda), `saffron.jpg`, `tulsi03.jpg`
- `Turmeric Flowers.jpeg`, `Turmeric plant.jpeg`, `Turmeric plant1.jpeg`
- Backgrounds: `bg6.jpg`, `firstBg.png`, `green-bg.jpg`, `Leaf-2560x1600.jpg`, `leafy.jpg`, `leafy1.jpg`, `leafy2.jpg`, `tree.jpg`
- UI elements: `Apple-Logo.png`, `Google__G__logo.svg.webp`, `Facebook_f_logo_(2021).svg.png`, `comming_soon.png`

---

### 2.4 Academic Deliverables & Documents
Preserved in `docs/`:
- `Virtual_Herbal_Garden_Final_Project_Report_43p.pdf` (23.18 MB, 43 pages, complete engineering documentation)
- `2025-03-28_Virtual_Herbal_Garden_Project_Presentation_22p.pdf` (5.36 MB, 22 slides, final project defense presentation)

---

## 3. Handling of Duplicates and Conflicts

1. **GitHub vs Local Source**: Where local text files contained enriched information (such as newly expanded plant descriptions and college affiliation in `index.html`), these enhancements were merged with the GitHub version's interactive chatbot widget to form a single best-of-both implementation.
2. **Damaged Recovery Stubs**: The zero-filled files on drive `D:\` were retained in place and quarantined in `delete_folder/` to protect against data loss while preventing invalid files from breaking the runtime 3D viewer.
3. **No Unnecessary Duplication**: Large model files are stored in `imp_assests/models/` for canonical versioning and in `code/frontend/models/` for direct relative referencing by the WebGL canvas, avoiding path traversal failures.

---

## 4. Path Reconciliation & Application Wiring

To ensure seamless execution, the following paths were standardized:
- Three.js model loader in `code/frontend/html/3d_garden.html` references relative path `../models/<PlantName>.glb`.
- Plant card images across `code/frontend/index.html` reference `images/<image-name>`.
- Individual plant profile pages in `code/frontend/plants_html/*.html` reference `../images/<image-name>` and `3d_garden.html?model=<plant_id>`.
- Hero background video in `code/frontend/index.html` references `videos/bg-video.mp4`.

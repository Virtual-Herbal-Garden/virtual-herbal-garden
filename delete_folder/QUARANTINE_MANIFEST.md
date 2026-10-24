# Quarantine Review Manifest

**Date**: 2026-10-24  
**Project**: Virtual Herbal Garden  
**Status**: All files preserved non-destructively for user inspection.

---

## Quarantined Items Inventory

| Original Path | Quarantine Location | Reason for Quarantine | Impact on Application | Recommended Action |
|---|---|---|---|---|
| `d:\...\Web App Final/` | `delete_folder/superseded_web_app_final/` | Superseded by modern directory structure (`code/frontend/`, `code/backend/`, `imp_assests/`). | None. All active scripts, styles, markup, and images copied to canonical directories. | Retain as offline archive; do not publish to Git. |
| `D:\delete_folder\damaged_herbal_models_and_videos\models\*.glb` (11 files) | External `D:\delete_folder\` (preserved on disk) | Corrupted raw recovery stubs: all 11 files consist of 100% null bytes (`0x00`), lacking `glTF` headers. | None. Genuine, verified GLB models with intact meshes/textures were recovered from GitHub `origin/main` commit `9dad73d`. | Keep on disk if desired; do not use in runtime. |
| `D:\delete_folder\damaged_herbal_models_and_videos\videos\bg-video.mp4` | External `D:\delete_folder\` (preserved on disk) | Corrupted raw recovery stub: 100% null bytes. | None. Genuine `bg-video.mp4` recovered from GitHub remote (`ftypdash` container intact). | Retain in external recovery folder. |
| `D:\delete_folder\damaged_college_undeleted_stubs\...\*.zip` (2 archives) | External `D:\delete_folder\` (preserved on disk) | Corrupted ZIP headers ("End of Central Directory record could not be found"). | None. Source code and documentation are fully available in local workspace and GitHub. | Keep on disk for manual data forensics if desired. |
| `Web App Final/Backend/.env` | `code/backend/.env` (Local only) & `delete_folder/superseded_web_app_final/Backend/.env` | Contains live MongoDB Atlas credentials and connection string. | Required for live MongoDB auth, but must never be committed publicly. | Keep local only; ignored by `.gitignore`. Documented via `.env.example`. |

---

## Data Safety Guarantee
No destructive disk commands (`rm`, `del`, `Remove-Item`, `git clean`) were executed during this operation. All original stubs remain in place.

# Quarantine Directory (`delete_folder/`)

## Purpose
This directory serves as a safe quarantine and retention area for files that have been superseded, corrupted during raw disk recovery, or moved during project restructuring.

**DATA SAFETY NOTICE**:
In accordance with strict repository data preservation protocols, **NO FILES ARE DELETED**. All legacy, duplicate, and recovery artifacts are preserved here for manual inspection and audit.

## Contents Overview
1. `superseded_web_app_final/`:
   - The unorganized, pre-restructure local workspace snapshot (`Web App Final/`).
   - All valid runtime code, styles, templates, and assets from this directory have been safely integrated into `code/frontend/`, `code/backend/`, and `imp_assests/`.
2. `QUARANTINE_MANIFEST.md`:
   - Detailed ledger recording the provenance, status, reason for quarantine, and review recommendations for each quarantined artifact.

## Git Configuration
This folder is configured in `.gitignore` to prevent committing superseded local files, sensitive connection strings, or recovery stubs to the public GitHub repository. Only this `README.md` and sanitized manifests should be tracked.

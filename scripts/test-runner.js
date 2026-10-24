// Virtual Herbal Garden - Comprehensive Integrity & Verification Test Suite
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function report(name, passed, detail = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  ✅ [PASS] ${name}${detail ? ' - ' + detail : ''}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${name}${detail ? ' - ' + detail : ''}`);
  }
}

console.log('════════════════════════════════════════════════════════════');
console.log('🌿 VIRTUAL HERBAL GARDEN - SYSTEM VERIFICATION SUITE');
console.log('════════════════════════════════════════════════════════════\n');

// 1. Directory Structure Checks
console.log('📁 1. Auditing Repository Structure...');
const requiredDirs = [
  'code/frontend',
  'code/frontend/css',
  'code/frontend/html',
  'code/frontend/plants_html',
  'code/frontend/images',
  'code/frontend/models',
  'code/frontend/videos',
  'code/frontend/experts',
  'code/backend',
  'code/netlify/functions',
  'imp_assests/models',
  'imp_assests/videos',
  'imp_assests/images',
  'docs',
  'delete_folder'
];

requiredDirs.forEach(d => {
  const p = path.join(ROOT_DIR, d);
  const exists = fs.existsSync(p) && fs.statSync(p).isDirectory();
  report(`Directory exists: ${d}`, exists);
});

// 2. 3D GLB Model Verification
console.log('\n🧊 2. Validating 3D GLB Models Integrity...');
const expectedModels = [
  'Ahwagandha.glb',
  'aloe_vera.glb',
  'bacopa_monnieri_plant.glb',
  'barberry_plant_in_pot.glb',
  'Cardamom.glb',
  'chamomile.glb',
  'Cinnamon.glb',
  'Clove.glb',
  'kalanchoe_calandiva.glb',
  'tulsi.glb',
  'Turmeric.glb'
];

expectedModels.forEach(m => {
  const modelPath = path.join(ROOT_DIR, 'imp_assests/models', m);
  const runtimePath = path.join(ROOT_DIR, 'code/frontend/models', m);
  const existsCanonical = fs.existsSync(modelPath);
  const existsRuntime = fs.existsSync(runtimePath);

  if (!existsCanonical || !existsRuntime) {
    report(`Model presence: ${m}`, false, 'Missing from canonical or runtime directory');
    return;
  }

  const buf = Buffer.alloc(12);
  const fd = fs.openSync(modelPath, 'r');
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);

  const magic = buf.toString('ascii', 0, 4);
  const version = buf.readUInt32LE(4);
  const headerLength = buf.readUInt32LE(8);
  const fileSize = fs.statSync(modelPath).size;

  const isValidGlb = (magic === 'glTF' && version === 2 && headerLength === fileSize);
  report(`Model valid glTF 2.0: ${m}`, isValidGlb, `Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
});

// 3. Video Asset Verification
console.log('\n🎬 3. Validating Video Assets...');
const videoPath = path.join(ROOT_DIR, 'imp_assests/videos/bg-video.mp4');
const runtimeVideoPath = path.join(ROOT_DIR, 'code/frontend/videos/bg-video.mp4');
const videoExists = fs.existsSync(videoPath) && fs.existsSync(runtimeVideoPath);
if (videoExists) {
  const vSize = fs.statSync(videoPath).size;
  const vBuf = Buffer.alloc(16);
  const vFd = fs.openSync(videoPath, 'r');
  fs.readSync(vFd, vBuf, 0, 16, 0);
  fs.closeSync(vFd);
  const hasFtyp = vBuf.toString('ascii', 4, 8) === 'ftyp';
  report('bg-video.mp4 container integrity', hasFtyp && vSize > 1000000, `${(vSize / 1024 / 1024).toFixed(2)} MB`);
} else {
  report('bg-video.mp4 exists', false, 'Missing video file');
}

// 4. HTML Entry Points & Plant Dossier Check
console.log('\n📄 4. Validating HTML Pages & Plant Dossiers...');
const expectedPlantPages = [
  'aloevera.html', 'ashwagandha.html', 'bacopa_monnieri.html', 'barberry.html',
  'cardamom.html', 'chamomile.html', 'cinnamon.html', 'clove.html',
  'ginger.html', 'kalnchoe.html', 'saffron.html', 'tulsi.html', 'turmeric.html'
];

expectedPlantPages.forEach(p => {
  const pagePath = path.join(ROOT_DIR, 'code/frontend/plants_html', p);
  const exists = fs.existsSync(pagePath);
  let hasContent = false;
  if (exists) {
    const text = fs.readFileSync(pagePath, 'utf8');
    hasContent = text.includes('Botanical Name:') && text.includes('Ayurvedic Taxonomy') && text.includes('Therapeutic Applications');
  }
  report(`Plant dossier: ${p}`, exists && hasContent);
});

// 5. Secret Leak Protection Check
console.log('\n🔒 5. Scanning for Accidental Secret Leaks...');
const filesToScan = [
  'code/frontend/index.html',
  'code/frontend/dashboard.html',
  'code/backend/index.js',
  'code/netlify/functions/chatbot.js',
  '.env.example',
  'README.md'
];

let leakDetected = false;
const sensitivePatterns = [
  /mongodb\+srv:\/\/[^:]+:[^@]+@/i,
  /AIzaSy[A-Za-z0-9_-]{33}/
];

filesToScan.forEach(f => {
  const fp = path.join(ROOT_DIR, f);
  if (fs.existsSync(fp)) {
    const text = fs.readFileSync(fp, 'utf8');
    sensitivePatterns.forEach(pat => {
      if (pat.test(text) && !text.includes('<username>') && !text.includes('<password>')) {
        leakDetected = true;
        report(`Secret leak check: ${f}`, false, 'Found sensitive pattern matching database or API key');
      }
    });
  }
});
if (!leakDetected) {
  report('Clean repository (No committed secrets or live connection strings)', true);
}

// 6. Academic Documentation Verification
console.log('\n📚 6. Validating Academic Documentation...');
const docFiles = [
  'docs/Virtual_Herbal_Garden_Final_Project_Report_43p.pdf',
  'docs/2025-03-28_Virtual_Herbal_Garden_Project_Presentation_22p.pdf',
  'docs/INITIAL_PROJECT_AUDIT.md',
  'docs/ASSET_RECOVERY_REPORT.md'
];

docFiles.forEach(df => {
  const dfp = path.join(ROOT_DIR, df);
  const exists = fs.existsSync(dfp) && fs.statSync(dfp).size > 1000;
  report(`Documentation file: ${df}`, exists, exists ? `${(fs.statSync(dfp).size / 1024).toFixed(0)} KB` : 'Missing');
});

// 7. Backend API Endpoint Verification
console.log('\n🚀 7. Running Backend Integration Test Suite...');
const { spawnSync } = require('child_process');
const backendRes = spawnSync('node', ['code/backend/test.js'], { cwd: ROOT_DIR, encoding: 'utf8' });
const backendSuccess = (backendRes.status === 0);

if (!backendSuccess) {
  console.error('Backend test failure output:', backendRes.stderr || backendRes.stdout);
}
report('Backend API endpoint suite (Health, Plants, Contact, Quiz, Chatbot)', backendSuccess);

// Summary
console.log('\n════════════════════════════════════════════════════════════');
console.log(`📊 TEST RESULTS SUMMARY: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('════════════════════════════════════════════════════════════\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All repository integrity, asset, security, and backend tests PASSED!\n');
  process.exit(0);
}

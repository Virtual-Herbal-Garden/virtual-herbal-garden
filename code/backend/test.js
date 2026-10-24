// Backend Test Suite for Virtual Herbal Garden API
// Ensure test runs in fast, clean in-memory mode without external socket timeouts
process.env.MONGODB_URI = '';
process.env.PORT = '5055';

const assert = require('assert');
const app = require('./index');

let server;
const TEST_PORT = 5055;

async function runTests() {
  console.log('🧪 Starting Virtual Herbal Garden API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  server = app.listen(TEST_PORT);
  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // Test 1: Health Endpoint
    console.log('1. Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'Health check should return status 200');
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'healthy');
    assert.strictEqual(healthData.specimens, 13, 'Should have 13 registered plant specimens');
    assert.strictEqual(healthData.models3D, 11, 'Should have 11 3D GLB models');
    console.log('   ✅ Health check passed. Status: healthy, 13 specimens, 11 3D models.');
    passed++;

    // Test 2: Plants Dataset Endpoint
    console.log('2. Testing GET /api/plants...');
    const plantsRes = await fetch(`${baseUrl}/api/plants`);
    assert.strictEqual(plantsRes.status, 200);
    const plantsData = await plantsRes.json();
    assert.strictEqual(plantsData.success, true);
    assert.strictEqual(plantsData.count, 13);
    assert(plantsData.data.some(p => p.id === 'tulsi'));
    assert(plantsData.data.some(p => p.id === 'ashwagandha'));
    console.log(`   ✅ Plants catalog passed. Verified ${plantsData.count} plants.`);
    passed++;

    // Test 3: Contact Form Submission
    console.log('3. Testing POST /api/contact...');
    const contactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Test Botanist',
        email: 'botanist@university.edu',
        subject: 'Taxonomy Verification',
        message: 'Verifying phytochemical profile for Ocimum tenuiflorum.'
      })
    });
    assert.strictEqual(contactRes.status, 201);
    const contactData = await contactRes.json();
    assert.strictEqual(contactData.success, true);
    console.log('   ✅ Contact submission passed.');
    passed++;

    // Test 4: Quiz Result Submission
    console.log('4. Testing POST /api/quiz/submit...');
    const quizRes = await fetch(`${baseUrl}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'StudentTester',
        score: 5,
        total: 5,
        category: 'Adaptogens'
      })
    });
    assert.strictEqual(quizRes.status, 201);
    const quizData = await quizRes.json();
    assert.strictEqual(quizData.success, true);
    console.log('   ✅ Quiz score submission passed.');
    passed++;

    // Test 5: Chatbot Generate Endpoint (Botanical query)
    console.log('5. Testing POST /api/generate (Botanical query)...');
    const chatRes = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'What are the medicinal properties of Tulsi?' })
    });
    assert.strictEqual(chatRes.status, 200);
    const chatData = await chatRes.json();
    assert(typeof chatData.reply === 'string' && chatData.reply.length > 20);
    console.log('   ✅ Chatbot botanical query passed. Reply generated.');
    passed++;

    // Test 6: Chatbot Domain Restriction (Off-topic query)
    console.log('6. Testing POST /api/generate (Domain restriction on off-topic)...');
    const offTopicRes = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Who won the cricket world cup?' })
    });
    const offTopicData = await offTopicRes.json();
    assert(offTopicData.reply.includes('only answer questions related to herbs'));
    console.log('   ✅ Chatbot domain restriction passed.');
    passed++;

    console.log(`\n🎉 All ${passed} backend tests passed successfully!\n`);
    server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
        process.exit(1);
      }
      process.exit(0);
    });
  } catch (err) {
    console.error(`\n❌ Test failed:`, err);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
}

runTests();

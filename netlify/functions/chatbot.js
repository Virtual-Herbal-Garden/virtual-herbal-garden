// netlify/functions/chatbot.js
// Herbal Garden specialized chatbot with domain restriction

const safeRequire = (name) => {
    try {
        return require(name);
    } catch (e) {
        return null;
    }
};

const GoogleGenerativeAI = safeRequire("@google/generative-ai")?.GoogleGenerativeAI;

// System instruction to restrict chatbot to herbal garden topics
const HERBAL_GARDEN_SYSTEM_INSTRUCTION = `You are a specialized Virtual Herbal Garden Assistant. You ONLY answer questions related to:

**ALLOWED TOPICS:**
- Herbs, medicinal plants, and garden plants
- Growing tips, cultivation methods, and plant care
- Soil types, sunlight requirements, watering schedules
- Fertilizers, composting, and organic gardening
- Medicinal properties and Ayurvedic uses of plants
- Health benefits, nutritional value of herbs
- Harvesting, preservation, and storage of herbs
- Natural remedies, herbal teas, and home remedies
- Plant identification and botanical information
- Pest control using natural methods
- Companion planting and garden design
- Seasonal planting guides

**STRICT RULES:**
1. If a user asks about ANY topic outside the above list (politics, technology, history, entertainment, sports, etc.), respond ONLY with:
   "I can only answer questions related to herbs, plants, and gardening. Please ask me about medicinal plants, growing tips, or natural remedies!"

2. Be friendly, informative, and encouraging about gardening
3. Provide practical, actionable advice
4. Use simple language that beginners can understand
5. When appropriate, mention safety precautions for medicinal use

Always stay within your domain. Never answer off-topic questions.`;

exports.handler = async (event) => {
    const CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: CORS_HEADERS, body: "" };
    }

    // Check SDK availability
    if (!GoogleGenerativeAI) {
        console.error("Missing @google/generative-ai package in dependencies.");
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Server misconfiguration: missing SDK." }),
        };
    }

    // Get API key from environment
    const API_KEY =
        process.env.GENERATIVE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.API_KEY;

    if (!API_KEY) {
        console.error("Missing Gemini API key environment variable.");
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: "Server misconfiguration: missing API key.",
            }),
        };
    }

    try {
        // Initialize Gemini client
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Parse request body
        let body = {};
        try {
            body = event.body ? JSON.parse(event.body) : {};
        } catch (err) {
            console.warn("Could not parse request body:", err);
            body = {};
        }

        // Extract user message and domain
        let userMessage = '';
        const domain = body.domain || '';

        if (body.prompt && typeof body.prompt === 'string') {
            userMessage = body.prompt;
        } else if (body.message && typeof body.message === 'string') {
            userMessage = body.message;
        } else if (body.contents && Array.isArray(body.contents) && body.contents[0]?.parts?.[0]?.text) {
            userMessage = body.contents[0].parts[0].text;
        }

        // Validate domain restriction
        if (domain !== 'herbal-garden') {
            console.warn('Request without proper domain parameter');
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: "Invalid request: domain parameter required",
                    reply: "I can only answer questions related to herbs, plants, and gardening."
                }),
            };
        }

        if (!userMessage || userMessage.trim() === '') {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: "No message provided",
                    reply: "Please ask me a question about herbs or plants!"
                }),
            };
        }

        // Get model with system instruction
        const modelName = process.env.GENERATIVE_MODEL || "gemini-2.0-flash-exp";

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: HERBAL_GARDEN_SYSTEM_INSTRUCTION
        });

        // Build conversation context
        const contents = [
            {
                role: "user",
                parts: [{ text: userMessage }]
            }
        ];

        // Generate response
        const result = await model.generateContent({ contents });
        const response = await result.response;

        // Validate response structure
        if (
            !response ||
            !response.candidates ||
            !Array.isArray(response.candidates) ||
            response.candidates.length === 0 ||
            !response.candidates[0].content
        ) {
            console.error("Invalid response from Gemini");
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: "AI provider returned invalid response",
                    reply: "I'm having trouble right now. Please try asking your question again!"
                }),
            };
        }

        const candidate = response.candidates[0];

        // Extract text from response
        let replyText = '';
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            replyText = candidate.content.parts[0].text || '';
        }

        // Additional safety check: if response seems off-topic, override it
        const offTopicKeywords = ['politics', 'election', 'president', 'war', 'movie', 'sport', 'technology', 'programming', 'code'];
        const lowerReply = replyText.toLowerCase();
        const seemsOffTopic = offTopicKeywords.some(keyword =>
            lowerReply.includes(keyword) && !lowerReply.includes('plant') && !lowerReply.includes('herb')
        );

        if (seemsOffTopic) {
            replyText = "I can only answer questions related to herbs, plants, and gardening. Please ask me about medicinal plants, growing tips, or natural remedies!";
        }

        // Return response in format expected by frontend
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                reply: replyText,
                content: candidate.content
            }),
        };

    } catch (err) {
        console.error("Chatbot function error:", err?.message || err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: "Failed to get response from AI",
                message: err?.message || "Unknown error",
                reply: "Sorry, I'm experiencing technical difficulties. Please try again in a moment."
            }),
        };
    }
};
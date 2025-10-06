// netlify/functions/chatbot.js
// Robust Gemini handler with CORS, better logging, and returns the candidate shape your frontend expects.

const safeRequire = (name) => {
    try {
        return require(name);
    } catch (e) {
        return null;
    }
};

const GoogleGenerativeAI = safeRequire("@google/generative-ai")?.GoogleGenerativeAI;

exports.handler = async (event) => {
    const CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*", // tighten to your origin later, e.g. https://virtual-herbal-garden-hub.netlify.app
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

    // Accept common env var names (you can set any of these in Netlify)
    const API_KEY =
        process.env.GENERATIVE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GENERATIVE_API ||
        process.env.API_KEY;

    if (!API_KEY) {
        console.error("Missing Gemini API key environment variable.");
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: "Server misconfiguration: missing Gemini API key. Set env var GENERATIVE_API_KEY (recommended).",
            }),
        };
    }

    try {
        // init client (SDK accepts key in constructor in current releases)
        const genAI = new GoogleGenerativeAI(API_KEY);

        // parse incoming body safely
        let body = {};
        try {
            body = event.body ? JSON.parse(event.body) : {};
        } catch (err) {
            console.warn("Could not JSON.parse request body, using raw:", err);
            body = event.body || {};
        }

        // The frontend already sends `contents: [{ parts: [{ text: "..."}]}]`
        // If the frontend uses { message: "..."} we convert to the expected shape.
        let contents = body.contents;
        if (!contents) {
            if (body.message && typeof body.message === "string") {
                contents = [{ parts: [{ text: body.message }] }];
            } else if (body.prompt && typeof body.prompt === "string") {
                contents = [{ parts: [{ text: body.prompt }] }];
            } else {
                // nothing meaningful, fallback
                contents = [{ parts: [{ text: "Hello" }] }];
            }
        }

        // pick a model (use env OPENAI_MODEL style name? we'll default to gemini-2.0-flash)
        const modelName = process.env.GENERATIVE_MODEL || "gemini-2.0-flash";

        // get model instance
        const model = genAI.getGenerativeModel({ model: modelName });

        // call generateContent. The SDK accepts the contents array directly in many versions.
        // Some examples call model.generateContent(contents) or model.generateContent({ contents })
        // We'll try both syntaxes to be robust.
        let resultPromise;
        try {
            // preferred: pass an object (latest SDKs)
            resultPromise = await model.generateContent({ contents });
        } catch (e) {
            // fallback: older SDKs may expect the contents array alone
            console.warn("generateContent({contents}) failed, trying generateContent(contents):", e?.message);
            resultPromise = await model.generateContent(contents);
        }

        // `resultPromise` often has `.response` (a Promise) we need to await
        const contentResponse = await resultPromise.response;

        // validate response structure
        if (
            !contentResponse ||
            !contentResponse.candidates ||
            !Array.isArray(contentResponse.candidates) ||
            contentResponse.candidates.length === 0 ||
            !contentResponse.candidates[0].content
        ) {
            console.error("Invalid response from Gemini:", JSON.stringify(contentResponse).slice(0, 2000));
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: "AI provider returned no candidates.", details: contentResponse }),
            };
        }

        // Return the first candidate object (this has .content.parts[...] which your frontend expects)
        const candidate = contentResponse.candidates[0];

        // Helpful: log small portion to Netlify logs for debugging (avoid printing entire content in prod)
        console.log("Gemini response candidate keys:", Object.keys(candidate));

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(candidate),
        };
    } catch (err) {
        console.error("Chatbot function error:", err && err.stack ? err.stack : err);
        // Provide some debug info (safe during development) — remove details in production
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Failed to get response from AI.", message: err ? err.message || String(err) : "unknown" }),
        };
    }
};

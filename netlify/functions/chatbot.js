// Import the Google AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the main function that Netlify will run
exports.handler = async (event) => {
    // 1. Get the API Key from the environment variables we set in Netlify
    const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);

    try {
        // 2. Get the user's message (prompt) from the frontend request
        const { prompt } = JSON.parse(event.body);

        // If there's no prompt, return an error
        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No prompt provided." }),
            };
        }

        // 3. Call the Google AI Model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. Send the AI's response back to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: text }),
        };
    } catch (error) {
        // Handle any errors
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to get response from AI." }),
        };
    }
};
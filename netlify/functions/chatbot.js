// netlify/functions/chatbot.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);

  try {
    // The frontend will send the full JSON body from your original code
    const body = JSON.parse(event.body);

    // Get the model with the correct, updated name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // The Google library can take the 'contents' object directly
    const result = await model.generateContent(body.contents);
    const response = await result.response;
    
    // Send the full candidate response back to the frontend
    // Your original frontend code knows how to handle this structure
    return {
      statusCode: 200,
      body: JSON.stringify(response.candidates[0]),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};
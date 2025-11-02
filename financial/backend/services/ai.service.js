// Make sure to load environment variables at the very start of your app
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Get the API key from environment variables
const apiKey = process.env.GOOGLE_GEMINI_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_KEY is not set in the environment variables.");
}

// 2. Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// 3. Use the correct and valid model name
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest', 
    systemInstruction : `you are a chartbot which clariify the doubt's`
 });

/**
 * Generates content based on a given prompt.
 * @param {string} prompt - The user's prompt.
 * @returns {Promise<string>} The generated text from the model.
 */
// 4. Corrected function name typo (generateContenet -> generateContent)
async function generateContent(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

module.exports = { generateContent };
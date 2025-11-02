require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with the key from environment
const apiKey = process.env.GOOGLE_GEMINI_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_KEY environment variable is not set");
}

// Initialize the AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model (gemini-pro is best for code)
const modelName = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

/**
 * Generate a code review using Gemini AI
 * @param {string} code - The code to review
 * @returns {Promise<string>} The review text in markdown format
 */
async function generateContent(code) {
  try {
    const prompt = `As an expert code reviewer, please analyze this code and provide detailed feedback in markdown format:

\`\`\`
${code}
\`\`\`

Please provide a comprehensive review focusing on:
1. Code Quality and Best Practices
   - Clean code principles
   - Naming and organization
   - Design patterns
2. Potential Issues
   - Logic errors
   - Edge cases
   - Error handling
3. Performance Considerations
   - Efficiency
   - Resource usage
4. Security Concerns
   - Vulnerabilities
   - Data validation
5. Improvement Suggestions
   - Code examples
   - Modern alternatives

Format your response in clear markdown sections.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return `⚠️ Unable to generate code review: ${error.message}

Please ensure:
1. Your Google Gemini API key is correctly set in GOOGLE_GEMINI_KEY
2. You have API access enabled
3. The service is available

If the problem persists, please check your API configuration or try again later.`;
  }
}

module.exports = { generateContent };

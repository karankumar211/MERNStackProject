require("dotenv").config();
const OpenAI = require("openai");

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model to use (gpt-4 is best for code review, fall back to gpt-3.5-turbo if needed)
const MODEL = process.env.OPENAI_MODEL || "gpt-4";

/**
 * Generate a code review using OpenAI
 * @param {string} code - The code to review
 * @returns {Promise<string>} The review text in markdown format
 */
async function generateContent(code) {
  try {
    const systemPrompt = `You are an expert software developer conducting a thorough code review. 
Your task is to analyze the code and provide detailed, constructive feedback in markdown format.
Include code examples when suggesting improvements.`;

    const userPrompt = `Please review this code and provide a detailed analysis:

\`\`\`
${code}
\`\`\`

Focus on:
1. Code Quality
   - Clean code principles
   - Design patterns
   - Naming conventions
   - Code organization
2. Potential Bugs
   - Logic errors
   - Edge cases
   - Error handling
3. Performance
   - Algorithmic efficiency
   - Resource usage
   - Bottlenecks
4. Security
   - Common vulnerabilities
   - Data validation
   - Security best practices
5. Improvements
   - Specific suggestions with examples
   - Modern practices
   - Maintainability tips

Format your response in clear markdown with sections.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating code review:", error);

    // Provide a user-friendly error message
    const errorMessage = error.response?.data?.error?.message || error.message;
    return `⚠️ Unable to generate code review: ${errorMessage}

Please ensure:
1. Your OpenAI API key is correctly set in the environment variables
2. You have sufficient API credits
3. The API is currently available

If the problem persists, please try again later or contact support.`;
  }
}

module.exports = { generateContent };

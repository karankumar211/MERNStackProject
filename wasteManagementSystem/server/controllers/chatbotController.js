// server/controllers/chatbotController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Handle chatbot conversation
// @route   POST /api/chatbot/ask
// @access  Public
exports.askChatbot = async (req, res) => {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required." });
  }

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the persona and context for the AI
    const systemInstruction = `You are "Eco," a friendly and helpful AI assistant for Plastic+, a platform that helps users recycle plastic waste. Your goal is to answer user questions about plastic recycling, our services, and the products we sell. Key information about Plastic+: Users can schedule pickups for their plastic waste, they earn reward points for recycling, and we sell products made from recycled plastic (like chairs, pots, benches). Your tone should be encouraging, positive, and focused on sustainability. Keep your answers concise and helpful.`;

    // Format the conversation history for Gemini
    // Gemini expects roles 'user' and 'model'. We'll map 'assistant' to 'model'.
    const geminiHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: "Hello, this is our first message. Here is your context." },
          ],
        },
        {
          role: "model",
          parts: [{ text: systemInstruction }],
        },
        ...geminiHistory,
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(question);
    const response = result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    res
      .status(500)
      .json({ message: "Failed to get a response from the AI assistant." });
  }
};

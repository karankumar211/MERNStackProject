import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Handle chatbot conversation
 * @route   POST /api/ai/chat
 */
export const getAiChatResponse = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: "A message is required." });
  }

  try {
    console.log("--- DEBUG 1: AI Controller reached ---");

    const userId = req.user._id;
    console.log("--- DEBUG 2: Got User ID:", userId, "---");

    const expenses = await Expense.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20);
    console.log("--- DEBUG 3: Successfully Fetched Expenses ---");

    const goals = await Goal.find({ userId });
    console.log("--- DEBUG 4: Successfully Fetched Goals ---");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const systemInstruction = `You are "FinVoice," a friendly and helpful AI financial assistant. Your personality is encouraging and supportive. Your primary goal is to answer general questions about finance. Your tone should be positive and helpful. Keep your answers concise.`;

    const geminiHistory = history.map((msg) => ({
      role: msg.sender === "bot" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello. Here are your instructions." }],
        },
        { role: "model", parts: [{ text: systemInstruction }] },
        ...geminiHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const reply = response.text();

    res.status(200).json({ reply });
    res.status(200).json({ reply: "Test successful" });
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    res.status(500).json({
      message:
        "I'm having trouble connecting to my AI brain right now. Please try again later.",
    });
  }
};

/**
 * @desc    Generate an AI-powered analysis of user's settings
 * @route   POST /api/ai/analyze-settings
 */
export const getSettingsAnalysis = async (req, res) => {
  const { income, inflationRate, history } = req.body;

  if (!income || !inflationRate || !history) {
    return res
      .status(400)
      .json({ message: "Income, inflation rate, and history are required." });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const prompt = `
            You are FinVoice, a sharp and encouraging financial analyst.
            Analyze the following user financial settings.
            - User's Monthly Income: ₹${income}
            - User's Personal Expected Inflation Rate: ${inflationRate}%
            - Historical Inflation Data (for context): ${JSON.stringify(
              history
            )}

            Based on this, provide a short, insightful, and "emotional" summary (2-3 sentences).
            1. Comment on their income level in an encouraging way.
            2. Compare their personal inflation expectation to the historical average.
            3. Conclude with a positive, forward-looking statement.
            Example: "That's a solid income! It's interesting that your inflation expectation is slightly higher than the recent average, showing you're planning cautiously. This awareness is a great foundation for building a strong financial future."
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.status(200).json({ analysis });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ message: "Failed to generate AI analysis." });
  }
};

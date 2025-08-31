import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askChatbot = async (req, res) => {
    // Receive the language from the request body
      console.log("Key from .env file:", process.env.GEMINI_API_KEY);
    const { message: question, history = [], language = 'en-US' } = req.body;

    if (!question) {
        return res.status(400).json({ message: "A question is required." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Add the language instruction to the prompt
        const systemInstruction = `You are "FinVoice," a friendly AI financial assistant. Your primary goal is to answer general finance questions.
        
        IMPORTANT: You MUST respond in the language that corresponds to this code: ${language}. For example, 'hi-IN' means you must respond in Hindi.`;

        const geminiHistory = history.map((msg) => ({
            role: msg.sender === "bot" ? "model" : "user",
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello. Here are your instructions." }] },
                { role: "model", parts: [{ text: systemInstruction }] },
                ...geminiHistory,
            ],
        });
        
        const result = await chat.sendMessage(question);
        const response = result.response;
        const answer = response.text();

        res.json({ answer });
    } catch (error) {
        console.error("Error communicating with Gemini AI:", error);
        res.status(500).json({ message: "Failed to get a response from the AI assistant." });
    }
};
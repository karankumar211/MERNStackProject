// A pre-defined list of questions and answers
const knowledgeBase = {
    greeting: "Hello! I'm your FinVoice assistant. How can I help you today?",
    spending: "You can track your spending by logging expenses with the microphone on the Dashboard!",
    goals: "You can manage your financial goals on the 'Goals' page to plan for your future.",
    planner: "The 'Planner' page helps you create a budget based on your income.",
    fallback: "I can help with questions about spending, goals, or the planner. Please try asking one of those!"
};

/**
 * @desc    Handle simple, rule-based chatbot conversation
 * @route   POST /api/simplebot/ask
 */
export const askSimplebot = async (req, res) => {
    const { message } = req.body;
    const input = message.toLowerCase();
    let reply;

    // Simple keyword matching logic
    if (input.includes('hello') || input.includes('hi')) {
        reply = knowledgeBase.greeting;
    } else if (input.includes('spend') || input.includes('expense')) {
        reply = knowledgeBase.spending;
    } else if (input.includes('goal') || input.includes('save')) {
        reply = knowledgeBase.goals;
    } else if (input.includes('plan') || input.includes('budget')) {
        reply = knowledgeBase.planner;
    } else {
        reply = knowledgeBase.fallback;
    }

    res.status(200).json({ reply });
};
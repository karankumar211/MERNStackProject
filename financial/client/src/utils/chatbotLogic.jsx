import * as api from '../api';

// The function now accepts and passes the language
export const getChatbotResponse = async (userInput, history, language) => {
    try {
        const { data } = await api.askChatbot({ message: userInput, history, language });
        return data.reply;
    } catch (error) {
        console.error("Error fetching AI reply:", error);
        return error.response?.data?.message || "Sorry, I'm having trouble connecting. Please try again.";
    }
};
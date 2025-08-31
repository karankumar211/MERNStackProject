import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { getChatbotResponse } from '../../utils/chatbotLogic';

const Chatbot = ({ isOpen, onClose, language }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you with your finances today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // This function automatically scrolls to the newest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { sender: 'user', text: inputValue };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        // Send the new message, the entire previous conversation history,
        // and the selected language to the backend
        const botResponseText = await getChatbotResponse(inputValue, messages, language);
        const botMessage = { sender: 'bot', text: botResponseText };

        setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 1000); // Simulate bot "thinking"
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-28 left-8 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-t-lg">
                <h3 className="font-bold">FinVoice Assistant</h3>
                <button onClick={onClose} className="hover:opacity-75 transition-opacity"><X /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-3 py-2 max-w-xs shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && 
                    <div className="justify-start">
                        <div className="rounded-lg px-3 py-2 bg-gray-200 text-gray-800 animate-pulse">
                            Typing...
                        </div>
                    </div>
                }
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors" disabled={isLoading}>
                    <Send />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
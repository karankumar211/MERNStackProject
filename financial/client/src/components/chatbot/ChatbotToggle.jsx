import { MessageSquare } from 'lucide-react';

const ChatbotToggle = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-8 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
      aria-label="Toggle Chatbot"
    >
      <MessageSquare size={32} />
    </button>
  );
};

export default ChatbotToggle;
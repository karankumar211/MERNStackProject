import { Mic } from 'lucide-react';

const FloatingMicButton = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-300
        ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
    >
      <Mic size={32} />
    </button>
  );
};

export default FloatingMicButton;
import { useState, useEffect, useRef } from 'react';

let recognition;
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
}

// The hook now accepts a language property
export const useSpeechRecognition = ({ language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  // Use a ref to hold the language to avoid re-creating listeners
  const langRef = useRef(language);
  langRef.current = language;

  const startListening = () => {
    if (!recognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    setTranscript('');
    setError(null);
    setIsListening(true);
    // Set the language every time you start listening
    recognition.lang = langRef.current;
    recognition.start();
  };
  
  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setIsListening(false);
    };
    const handleError = (event) => {
      setError(event.error);
      setIsListening(false);
    };
    const handleEnd = () => {
      setIsListening(false);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);
    
    // Cleanup function to remove listeners
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', handleEnd);
    };
  }, []);

  return { isListening, transcript, error, startListening };
};
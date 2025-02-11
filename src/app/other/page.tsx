// app/page.js
'use client';
import { useState, useEffect, useCallback } from 'react';

export default function SpeechApp() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Browser compatibility check
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setText(prevText => prevText + finalTranscript + ' ');
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          if (isListening) {
            recognition.start();
          }
        };

        setRecognition(recognition);
      }
    }
  }, [isListening]);

  // Initialize text-to-speech voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening]);

  const speak = () => {
    if (!text) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeaking(false);
  };

  const clearText = () => {
    setText('');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Speech Converter</h1>
          <p className="text-gray-600 mt-2">Convert between speech and text</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-end space-x-2">
            <button
              onClick={clearText}
              className="px-3 py-1 text-sm rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              Clear
            </button>
          </div>

          <textarea
            placeholder="Enter text or click 'Start Listening' to convert speech to text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full sm:w-[200px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>

            <div className="flex flex-1 space-x-2">
              <button
                onClick={toggleListening}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium 
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                  }`}
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </button>

              <button
                onClick={speak}
                disabled={speaking || !text}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium 
                  ${speaking || !text 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }`}
              >
                {speaking ? 'Speaking...' : 'Speak'}
              </button>
              
              {speaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 active:bg-red-700"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
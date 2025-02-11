// app/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('en-US-Standard-A');
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace the voice loading useEffect with a static list of Google voices
  const voices = [
    { name: 'en-US-Standard-A', label: 'US English - Female' },
    { name: 'en-US-Standard-B', label: 'US English - Male' },
    { name: 'en-US-Standard-C', label: 'US English - Female 2' },
    { name: 'en-US-Standard-D', label: 'US English - Male 2' },
    { name: 'en-US-Standard-E', label: 'US English - Female 3' },
    { name: 'en-US-Standard-F', label: 'US English - Female 4' },
    { name: 'en-US-Standard-G', label: 'US English - Female 5' },
    { name: 'en-US-Standard-H', label: 'US English - Female 6' },
    { name: 'en-US-Standard-I', label: 'US English - Male 3' },
    { name: 'en-US-Standard-J', label: 'US English - Male 4' },
  ];

  const speak = useCallback(async () => {
    if (!text || loading) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Play the audio
      const audio = new Audio(url);
      audio.play();
      setSpeaking(true);
      
      audio.onended = () => {
        setSpeaking(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [text, selectedVoice, loading]);

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeaking(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Text to Speech Converter</h1>
        </div>
        
        <div className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <textarea
            placeholder="Enter text to convert to speech..."
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
                  {voice.label}
                </option>
              ))}
            </select>

            <div className="flex space-x-2">
              <button
                onClick={speak}
                disabled={loading || speaking || !text}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium 
                  ${loading || speaking || !text 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }`}
              >
                {loading ? 'Generating...' : speaking ? 'Speaking...' : 'Speak'}
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

          {audioUrl && (
            <a
              href={audioUrl}
              download={`speech_${Date.now()}.mp3`}
              className="inline-block px-4 py-2 rounded-lg text-white font-medium bg-green-500 hover:bg-green-600 active:bg-green-700"
            >
              Download Audio
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
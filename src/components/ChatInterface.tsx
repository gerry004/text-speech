import { useState, useRef } from 'react';
import { FileUploader } from './FileUploader';
import { PodcastScript } from './PodcastScript';

export default function ChatInterface() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Combine text input and files
      const formData = new FormData();
      formData.append('text', inputText);
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate script');
      
      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (error) {
      console.error('Error generating script:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          Turn Your Lecture Notes into Podcasts
        </h1>
      </header>

      {/* Chat/Script Area */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="text-center text-gray-600 my-4">
            Generating podcast script...
          </div>
        )}

        {generatedScript && (
          <PodcastScript script={generatedScript} />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2">
            <FileUploader files={files} setFiles={setFiles} />
            
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Gemini..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none overflow-hidden py-1 px-3"
              rows={1}
              style={{ minHeight: '24px' }}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!inputText && files.length === 0)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="loading">⏳</span>
              ) : (
                <span>➤</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Turn your lecture notes into podcasts
      </h1>

      <div className="space-y-4">
        <FileUploader files={files} setFiles={setFiles} />

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your lecture notes here..."
            className="w-full min-h-[200px] p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!inputText && files.length === 0)}
            className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-300"
          >
            {isLoading ? (
              <span className="loading">⏳</span>
            ) : (
              <span>➤</span>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-gray-600">
            Generating podcast script...
          </div>
        )}

        {generatedScript && (
          <PodcastScript script={generatedScript} />
        )}
      </div>
    </div>
  );
} 
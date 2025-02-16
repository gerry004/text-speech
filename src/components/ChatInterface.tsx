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

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-gray-100">
      {/* Header */}
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100">
          Turn Your Lecture Notes into Podcasts
        </h1>
      </header>

      {/* Chat/Script Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* File Display */}
        {files.length > 0 && (
          <div className="mb-4 p-4 rounded-lg bg-[#2A2A2A]">
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-[#3A3A3A] rounded-lg px-3 py-2"
                >
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                  </svg>
                  <span className="text-sm text-gray-300">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 text-gray-400 hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400 my-4">
            Generating podcast script...
          </div>
        )}

        {generatedScript && (
          <PodcastScript script={generatedScript} />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center gap-2 bg-[#2A2A2A] rounded-full p-2">
            <FileUploader setFiles={setFiles} />
            
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Upload files or paste your notes here..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none overflow-hidden py-1 px-3 text-gray-100 placeholder-gray-500"
              rows={1}
              style={{ minHeight: '24px' }}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!inputText && files.length === 0)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-200 disabled:opacity-30 transition-colors"
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
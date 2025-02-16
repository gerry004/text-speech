import { useState } from 'react';

interface PodcastScriptProps {
  script: string;
}

export function PodcastScript({ script }: PodcastScriptProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <pre className="whitespace-pre-wrap font-sans">{script}</pre>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Edit Script
        </button>
        <button
          onClick={handleGenerateAudio}
          disabled={isGeneratingAudio}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Generate Podcast Audio
        </button>
      </div>

      {isEditing && (
        <div className="space-y-4">
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="Describe how you'd like to edit the script..."
            className="w-full p-4 rounded-lg border"
          />
          <button
            onClick={() => {
              // Handle edit submission
              setIsEditing(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit Edit
          </button>
        </div>
      )}

      {isGeneratingAudio && (
        <div className="text-center text-gray-600">
          Generating podcast audio...
        </div>
      )}

      {audioUrl && (
        <div className="space-y-4">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
          <a
            href={audioUrl}
            download="podcast.mp3"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
} 
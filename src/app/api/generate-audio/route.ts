import { NextResponse } from 'next/server';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// You can choose different voice IDs from ElevenLabs
const VOICE_IDS = {
  host1: 'pNInz6obpgDQGcFmaJgB', // Adam - male voice
  host2: 'EXAVITQu4vr4xnSDxMaL'  // Rachel - female voice
};

export async function POST(request: Request) {
  try {
    const { script } = await request.json();
    
    // Split script into parts for different voices
    const parts = script.split('\n').filter(Boolean);
    const audioContents: Buffer[] = [];

    for (const part of parts) {
      const isHost1 = part.startsWith('Host 1:');
      const cleanText = part.replace(/Host [12]:/, '').trim();
      
      const response = await fetch(`${ELEVEN_LABS_API_URL}/${isHost1 ? VOICE_IDS.host1 : VOICE_IDS.host2}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY!,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.3,
            speaking_rate: 1.1
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      audioContents.push(Buffer.from(audioBuffer));
    }

    // Combine all audio buffers
    const combinedAudio = Buffer.concat(audioContents);

    return new NextResponse(combinedAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function POST(request: Request) {
  try {
    const { script } = await request.json();
    
    // Split script into parts for different voices
    const parts = script.split('\n').filter(Boolean);
    const audioContents: Buffer[] = [];

    for (const part of parts) {
      const isHost1 = part.startsWith('Host 1:');
      const [response] = await client.synthesizeSpeech({
        input: { text: part.replace(/Host [12]:/, '').trim() },
        voice: {
          languageCode: 'en-US',
          name: isHost1 ? 'en-US-Standard-B' : 'en-US-Standard-A',
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1,
        },
      });

      if (response.audioContent) {
        audioContents.push(Buffer.from(response.audioContent));
      }
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
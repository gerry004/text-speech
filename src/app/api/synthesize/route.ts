import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Initialize the client with credentials
const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: voice,
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1,
      },
    });

    const audioContent = response.audioContent;
    if (!audioContent) {
      throw new Error('No audio content received');
    }

    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
} 
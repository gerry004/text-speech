import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const files = formData.getAll('files') as File[];

    // Process PDF files if present
    let combinedText = text;
    if (files.length > 0) {
      // Add PDF processing logic here
      // You'll need a PDF parsing library like pdf-parse
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI that converts lecture notes into engaging podcast conversations between two hosts.
            Host 1 is an expert in the subject and Host 2 is a curious student.
            Include real-world examples and ensure questions are thought-provoking.`
        },
        {
          role: "user",
          content: combinedText
        }
      ],
    });

    const script = completion.choices[0].message.content;

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
} 
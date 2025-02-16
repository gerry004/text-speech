import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const files = formData.getAll('files') as File[];

    let combinedText = text;

    if (files.length > 0) {
      try {
        const pdfTexts = await Promise.all(
          files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            try {
              const data = await pdf(buffer);
              return data.text;
            } catch (pdfError) {
              console.error('Error parsing PDF:', pdfError);
              return ''; // Return empty string if PDF parsing fails
            }
          })
        );
        combinedText = [text, ...pdfTexts].filter(Boolean).join('\n\n');
      } catch (filesError) {
        console.error('Error processing files:', filesError);
        // Continue with just the text if file processing fails
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI that converts lecture notes into engaging podcast conversations between two hosts.
            Host 1 is an expert in the subject and Host 2 is a curious student.
            Include real-world examples and ensure questions are thought-provoking. 
            Make it feel like a natural conversation, fun, humorous, and engaging.
            Make it transition from fun explanantions for a 5 year old, then simple explanations without jargon for a college student.`
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
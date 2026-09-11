// app/api/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Updated model name to gemini-3.6-flash
    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      history: history || [],
      config: {
        systemInstruction:
          'You are an AI Virtual Assistant on a public School Management System portal for students.',
      },
    });

    const response = await chat.sendMessage({ message });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat request.' },
      { status: 500 }
    );
  }
}
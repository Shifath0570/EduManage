import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured.' }, { status: 500 });
    }
    const groq = new Groq({ apiKey });
    const { prompt, issuerName, issuerDesignation, issuerEmail, issuerContact } = await req.json();

    const systemPrompt = `You are an administrative AI assistant. Generate a notice based on the request.
Return ONLY valid JSON matching this structure:
{
  "title": "Short string",
  "issuedBy": {
    "name": "${issuerName || 'Prof. Kevin Martinez'}",
    "designation": "${issuerDesignation || 'Director - Career Services'}",
    "email": "${issuerEmail || 'career@university.edu'}",
    "contactNumber": "${issuerContact || '+1-555-678-9012'}"
  },
  "content": {
    "subject": "Clear subject line",
    "summary": "1-2 sentence overview",
    "fullText": "Detailed text with \\n for line breaks"
  },
  "status": "active",
  "isActive": true,
  "issuedDate": "${new Date().toISOString()}",
  "effectiveDate": "${new Date().toISOString()}",
  "expiryDate": "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'Empty response from model' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('Groq Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fallback when Groq fails or key is missing
function generateLocalQuestionPaper(input: {
  prompt?: string;
  subject?: string;
  gradeLevel?: string;
  schoolName?: string;
  teacherName?: string;
  totalMarks?: number;
}) {
  const subject = input.subject || 'General Science';
  const gradeLevel = input.gradeLevel || 'Grade 10';
  const schoolName = input.schoolName || 'Ideal High School';
  const teacherName = input.teacherName || 'Instructor';
  const totalMarks = Number(input.totalMarks) || 100;
  const marksPerQuestion = Math.max(2, Math.round(totalMarks / 5));

  return {
    header: {
      schoolName,
      subject,
      gradeLevel,
      teacherName,
      totalMarks,
      duration: '1 Hour',
    },
    instructions: [
      `All questions in this ${subject} examination are compulsory.`,
      'Write your answers clearly and show working where required.',
      `Total time allotted for this exam is 1 Hour. Total marks: ${totalMarks}.`,
    ],
    questions: [
      {
        id: 1,
        question: `Define the main concept in ${subject} and explain why it is important in daily life.`,
        options: ['A clear definition', 'A short guess', 'A random fact', 'No explanation'],
        marks: marksPerQuestion,
      },
      {
        id: 2,
        question: `Which of the following best describes the process related to ${subject}?`,
        options: [
          'Correct scientific explanation',
          'A personal opinion',
          'An unrelated statement',
          'An incomplete answer',
        ],
        marks: marksPerQuestion,
      },
      {
        id: 3,
        question: `Explain one practical example of ${subject} in real-world use.`,
        options: [
          'A real-world application',
          'A false statement',
          'An unrelated idea',
          'A missing answer',
        ],
        marks: marksPerQuestion,
      },
      {
        id: 4,
        question: `What is the most important step when solving a ${subject} problem?`,
        options: [
          'Analyze the problem carefully',
          'Skip the question',
          'Guess without checking',
          'Ignore the method',
        ],
        marks: marksPerQuestion,
      },
      {
        id: 5,
        question: `Write a short paragraph describing one key concept of ${subject}.`,
        options: [
          'A well-structured answer',
          'A vague statement',
          'A partial explanation',
          'No attempt',
        ],
        marks: marksPerQuestion,
      },
    ],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      subject,
      gradeLevel,
      schoolName,
      teacherName,
      totalMarks,
    } = body;

    const safeSchool = schoolName || 'Ideal High School';
    const safeSubject = subject || 'General Science';
    const safeGrade = gradeLevel || 'Grade 10';
    const safeTeacher = teacherName || 'Instructor';
    const safeTotalMarks = Number(totalMarks) || 100;

    // Same style as your working notice route
    const systemPrompt = `You are an administrative AI assistant specializing in exam creation. Generate a complete question paper.
Return ONLY valid JSON matching this exact structure:
{
  "header": {
    "schoolName": "${safeSchool}",
    "subject": "${safeSubject}",
    "gradeLevel": "${safeGrade}",
    "teacherName": "${safeTeacher}",
    "totalMarks": ${safeTotalMarks},
    "duration": "1 Hour"
  },
  "instructions": [
    "Instruction 1",
    "Instruction 2"
  ],
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "marks": 2
    }
  ]
}

Rules:
- Create questions that match the user's request.
- Prefer multiple-choice questions with exactly 4 options when possible.
- You may also include short-answer questions (leave "options" as an empty array or omit it).
- Distribute marks so the sum of all question marks equals totalMarks.
- Make questions appropriate for the given grade level and subject.
- Do not add any extra text outside the JSON.`;

    // No API key → local fallback
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        generateLocalQuestionPaper({
          prompt,
          subject: safeSubject,
          gradeLevel: safeGrade,
          schoolName: safeSchool,
          teacherName: safeTeacher,
          totalMarks: safeTotalMarks,
        })
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: prompt || 'Generate a question paper for the selected subject.',
        },
      ],
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      // Fallback if model returns empty
      return NextResponse.json(
        generateLocalQuestionPaper({
          prompt,
          subject: safeSubject,
          gradeLevel: safeGrade,
          schoolName: safeSchool,
          teacherName: safeTeacher,
          totalMarks: safeTotalMarks,
        })
      );
    }

    const parsed = JSON.parse(content);

    // Light validation
    if (
      !parsed?.header ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0
    ) {
      return NextResponse.json(
        generateLocalQuestionPaper({
          prompt,
          subject: safeSubject,
          gradeLevel: safeGrade,
          schoolName: safeSchool,
          teacherName: safeTeacher,
          totalMarks: safeTotalMarks,
        })
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Groq Error:', error);

    // On any error, still try to return a usable paper
    try {
      const body = await req.json().catch(() => ({}));
      return NextResponse.json(
        generateLocalQuestionPaper({
          prompt: body?.prompt,
          subject: body?.subject,
          gradeLevel: body?.gradeLevel,
          schoolName: body?.schoolName,
          teacherName: body?.teacherName,
          totalMarks: body?.totalMarks,
        })
      );
    } catch {
      return NextResponse.json(
        { error: error?.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
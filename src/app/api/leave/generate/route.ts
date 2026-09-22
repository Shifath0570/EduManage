
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: GEMINI_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const payload = await request.json();

    const { 
      role = "TEACHER", 
      teacherName, 
      department, 
      studentName, 
      grade, 
      rollNumber, 
      leaveType, 
      startDate, 
      endDate, 
      purpose 
    } = payload;

    if (!purpose || typeof purpose !== "string" || !purpose.trim()) {
      return NextResponse.json(
        { error: "Purpose of leave is required." },
        { status: 400 }
      );
    }

    let prompt = "";

    if (role === "STUDENT") {
      prompt = `
You are an administrative AI assistant inside the EduManage School Management System.
Write a formal leave application letter from a school student (or their guardian) to their Class Teacher / Principal.

Student Name: ${studentName || "Student"}
Class / Grade: ${grade || "General Class"}
Roll Number: ${rollNumber || "N/A"}
Type of Leave: ${leaveType || "Sick Leave"}
Leave Duration: From ${startDate || "[Start Date]"} to ${endDate || "[End Date]"}
Purpose / Reason: ${purpose}

Instructions:
1. Write in a polite, respectful tone suitable for a school student addressing their Class Teacher or Principal.
2. Address it to "To The Class Teacher, EduManage School".
3. Include a formal subject line, date duration, and state that missed schoolwork/assignments will be completed upon returning.
4. Output ONLY the raw letter text. Do NOT surround with markdown backticks (\`\`\`), code blocks, or conversational setup sentences.
`;
    } else {
      prompt = `
You are an administrative AI assistant inside the EduManage School Management System.
Write a formal leave application letter from a school teacher to the school principal.

Teacher Name: ${teacherName || "Teacher"}
Department: ${department || "General"}
Type of Leave: ${leaveType || "Casual Leave"}
Leave Duration: From ${startDate || "[Start Date]"} to ${endDate || "[End Date]"}
Purpose / Reason: ${purpose}

Instructions:
1. Write in a formal, respectful tone suitable for school administration.
2. Address it to "To The Principal, EduManage School".
3. Include subject line, date duration, and a brief note about class/syllabus management during absence.
4. Output ONLY the raw letter text. Do NOT surround with markdown backticks (\`\`\`), code blocks, or conversational setup sentences.
`;
    }

    // Call Gemini Flash model
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash", 
      contents: prompt,
    });

    let generatedLetter = response.text || "";

    // Clean up any stray markdown code blocks returned by the model
    generatedLetter = generatedLetter
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/, "")
      .trim();

    return NextResponse.json({ applicationLetter: generatedLetter });
  } catch (error: any) {
    console.error("Gemini API Route Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate application letter using Gemini API" },
      { status: 500 }
    );
  }
}




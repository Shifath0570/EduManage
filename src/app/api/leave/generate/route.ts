
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Local fallback function for Student Leave Applications
function generateStudentFallback({
  studentName,
  className,
  section,
  roll,
  leaveType,
  startDate,
  endDate,
  purpose,
}: Record<string, string | undefined>) {
  return `To
The Class Teacher / Principal
EduManage School

Subject: Application for ${leaveType || "Leave of Absence"}

Respected Sir/Madam,

I am writing to formally request leave of absence from ${startDate || "[Start Date]"} to ${endDate || "[End Date]"} due to ${purpose || "personal reasons"}.

Student Details:
- Name: ${studentName || "Student"}
- Class: ${className || "N/A"} (${section || "A"})
- Roll No: ${roll || "N/A"}

I will ensure that I complete all missed classwork and homework upon my return to school. I kindly request you to grant me leave for the specified duration.

Thanking you.

Yours obediently,
${studentName || "Student"}`;
}

// Local fallback function for Teacher Leave Applications
function generateTeacherFallback({
  teacherName,
  department,
  subject,
  leaveType,
  startDate,
  endDate,
  purpose,
  substituteTeacher,
}: Record<string, string | undefined>) {
  return `To
The Principal / Headmaster
EduManage School

Subject: Application for ${leaveType || "Leave"} - ${teacherName || "Teacher"}

Respected Principal,

I am writing to formally request leave from ${startDate || "[Start Date]"} to ${endDate || "[End Date]"} due to ${purpose || "personal reasons"}.

Teacher Details:
- Name: ${teacherName || "Teacher"}
- Department / Role: ${department || subject || "Faculty"}
${substituteTeacher ? `- Substitute Arrangements: Classes will be covered by ${substituteTeacher}` : ""}

I have arranged for my classes and duties during my absence so that student learning is not disrupted. I request you to kindly approve my leave application.

Thanking you.

Yours sincerely,
${teacherName || "Teacher"}`;
}

export async function POST(request: Request) {
  let payload: Record<string, any> = {};
  
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Determine user role (defaults to 'student' if not specified)
  const role = (payload.role || payload.userType || "student").toLowerCase();

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackLetter =
        role === "teacher"
          ? generateTeacherFallback(payload)
          : generateStudentFallback(payload);

      return NextResponse.json({ applicationLetter: fallbackLetter });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build role-specific prompt
    let prompt = "";

    if (role === "teacher") {
      prompt = `
Write a formal leave application letter from a school teacher to the Principal/Headmaster.
Teacher Name: ${payload.teacherName || payload.name || "Teacher"}
Department / Role: ${payload.department || payload.designation || "Faculty"}
Leave Type: ${payload.leaveType || "Casual Leave"}
Dates: From ${payload.startDate || "[Start Date]"} to ${payload.endDate || "[End Date]"}
Reason / Purpose: ${payload.purpose}
${payload.substituteTeacher ? `Substitute Teacher for classes: ${payload.substituteTeacher}` : ""}

Instructions:
1. Write in a highly professional and respectful administrative tone.
2. Address it to "To The Principal, EduManage School".
3. Mention that arrangements have been made for classes/duties during the absence.
4. Output ONLY the raw letter text. Do NOT surround with markdown backticks or conversational setup text.
`;
    } else {
      prompt = `
Write a formal leave application letter from a student to their class teacher or principal.
Student Name: ${payload.studentName || payload.name || "Student"}
Class: ${payload.className || "N/A"} (${payload.section || "A"})
Roll Number: ${payload.roll || "N/A"}
Leave Type: ${payload.leaveType || "Sick Leave"}
Dates: From ${payload.startDate || "[Start Date]"} to ${payload.endDate || "[End Date]"}
Reason / Purpose: ${payload.purpose}

Instructions:
1. Write in a polite, respectful tone suitable for a school student.
2. Address it to "To The Class Teacher / Principal, EduManage School".
3. Mention completing missed classwork upon return.
4. Output ONLY the raw letter text. Do NOT surround with markdown backticks or conversational setup text.
`;
    }

    // Call Gemini API (Fixed model identifier)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let generatedLetter = response.text || "";

    // Clean up code block markup if returned
    generatedLetter = generatedLetter
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/, "")
      .trim();

    if (!generatedLetter) {
      generatedLetter =
        role === "teacher"
          ? generateTeacherFallback(payload)
          : generateStudentFallback(payload);
    }

    return NextResponse.json({ applicationLetter: generatedLetter });
  } catch (error: any) {
    console.warn(
      `Gemini API Error (${error?.status || error?.message}). Using local fallback template for ${role}.`
    );

    const fallbackLetter =
      role === "teacher"
        ? generateTeacherFallback(payload)
        : generateStudentFallback(payload);

    return NextResponse.json({ applicationLetter: fallbackLetter });
  }
}






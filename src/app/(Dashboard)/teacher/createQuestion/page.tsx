"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Question {
  id?: number;
  type?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

interface QuestionPaper {
  header: {
    schoolName: string;
    subject: string;
    gradeLevel: string;
    teacherName: string;
    totalMarks: number;
    duration: string;
  };
  instructions: string[];
  questions: Question[];
}

export default function QuestionGeneratorPage() {
  const pdfRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState(
    "Create 5 multiple choice questions and 2 short answer questions about Photosynthesis."
  );
  const [subject, setSubject] = useState("Biology");
  const [gradeLevel, setGradeLevel] = useState("Grade 10");
  const [schoolName, setSchoolName] = useState("Ideal High School");
  const [teacherName, setTeacherName] = useState("Mr. Rahman");
  const [totalMarks, setTotalMarks] = useState(25);

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          subject,
          gradeLevel,
          schoolName,
          teacherName,
          totalMarks: Number(totalMarks),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate question paper");
      }

      const dynamicInstructions =
        Array.isArray(data?.instructions) && data.instructions.length > 0
          ? data.instructions
          : [
              `All questions in this ${subject} examination are compulsory.`,
              `Write all answers clearly in the provided space.`,
              `Total time allotted for this exam is ${data?.header?.duration || "1 Hour"}.`,
            ];

      const formattedPaper: QuestionPaper = {
        header: {
          schoolName: data?.header?.schoolName || data?.schoolName || schoolName,
          subject: data?.header?.subject || data?.subject || subject,
          gradeLevel: data?.header?.gradeLevel || data?.gradeLevel || gradeLevel,
          teacherName: data?.header?.teacherName || data?.teacherName || teacherName,
          totalMarks: data?.header?.totalMarks || data?.totalMarks || totalMarks,
          duration: data?.header?.duration || data?.duration || "1 Hour",
        },
        instructions: dynamicInstructions,
        questions: Array.isArray(data?.questions) ? data.questions : [],
      };

      if (formattedPaper.questions.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }

      setPaper(formattedPaper);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating questions.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    setIsDownloadingPdf(true);

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDocument) => {
          clonedDocument.querySelectorAll("*").forEach((element) => {
            const el = element as HTMLElement;
            const style = getComputedStyle(el);

            if (style.color.includes("lab")) el.style.color = "#000000";
            if (style.backgroundColor.includes("lab"))
              el.style.backgroundColor = "#ffffff";
            if (style.borderColor.includes("lab")) el.style.borderColor = "#dddddd";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${subject.replace(/\s+/g, "_")}_Question_Paper.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            AI Question Paper Generator
          </h1>

          <form onSubmit={handleGenerateQuestions} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Grade Level
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Topic / Custom Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe topics, question types, or difficulty level..."
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isGeneratingAi}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded transition-all disabled:opacity-70"
            >
              {isGeneratingAi ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating Questions...</span>
                </>
              ) : (
                <span>Generate Question Paper</span>
              )}
            </button>
          </form>
        </div>

        {paper && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={downloadPDF}
                disabled={isDownloadingPdf}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded transition-all disabled:opacity-70"
              >
                {isDownloadingPdf ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Creating PDF...</span>
                  </>
                ) : (
                  <span>Download PDF</span>
                )}
              </button>
            </div>

            <div
              ref={pdfRef}
              className="bg-white p-10 border border-gray-200 rounded-lg shadow-sm font-serif leading-relaxed text-gray-900"
            >
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-wide">
                  {paper.header.schoolName}
                </h2>
                <h3 className="text-lg font-semibold mt-1">
                  Class Examination — {paper.header.gradeLevel}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Subject:{" "}
                  <span className="font-semibold text-gray-900">
                    {paper.header.subject}
                  </span>
                </p>

                <div className="flex justify-between items-center text-xs font-sans font-semibold mt-4 text-gray-700 border-t border-gray-200 pt-2">
                  <span>Teacher: {paper.header.teacherName}</span>
                  <span>Time: {paper.header.duration}</span>
                  <span>Total Marks: {paper.header.totalMarks}</span>
                </div>
              </div>

              {paper.instructions.length > 0 && (
                <div className="mb-6 text-xs font-sans text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="font-bold text-gray-800">Instructions:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {paper.instructions.map((inst, index) => (
                      <li key={index}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {paper.questions.map((q, idx) => (
                  <div key={q.id || idx} className="text-sm">
                    <div className="flex justify-between items-start font-medium">
                      <p className="pr-4">
                        <span className="font-bold mr-1">{idx + 1}.</span>{" "}
                        {q.question}
                      </p>
                      <span className="font-sans text-xs font-bold text-gray-600 whitespace-nowrap">
                        [{q.marks} {q.marks === 1 ? "mark" : "marks"}]
                      </span>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2 ml-4 text-xs font-sans">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="text-gray-700">
                            <span className="font-semibold text-gray-900">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>{" "}
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-400 font-sans">
                *** End of Question Paper ***
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
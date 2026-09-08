"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Printer,
  RotateCcw,
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface SubQuestion {
  label: string;
  text?: string;
  question?: string;
  marks: number;
  suggestedAnswer?: string;
}

interface Question {
  questionNumber: number | string;
  type?: "mcq" | "short" | "creative" | "broad" | string;
  text?: string;
  question?: string;
  options?: string[];
  correctOptionIndex?: number;
  marks: number;
  suggestedAnswer?: string;
  subQuestions?: SubQuestion[];
}

interface Section {
  title?: string;
  sectionTitle?: string;
  instructions: string;
  sectionMarks: number;
  questions: Question[];
}

interface QuestionPaperData {
  _id: string;
  examId: string;
  examName: string;
  className: string;
  stream?: string;
  section?: string;
  subject: string;
  academicYear: string;
  examDate?: string;
  totalMarks: number;
  duration: string;
  generalInstructions: string[];
  sections: Section[];
  generatedBy?: string;
  createdAt?: string;
}

interface ExamInfo {
  _id: string;
  examName: string;
  examType: string;
  className: string;
  stream?: string;
  section?: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  duration?: string;
  status: string;
  description?: string;
}

export default function QuestionPaperPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaperData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Exam and Question Paper Data
  const fetchData = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/question-papers/exam/${examId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load examination question paper.");
      }

      setExam(data.data.exam);
      setQuestionPaper(data.data.questionPaper);
    } catch (err) {
      console.error("Fetch question paper error:", err);
      setError(err instanceof Error ? err.message : "Error connecting to server.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE, examId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate Question Paper with AI
  const handleGenerate = async (forceRegenerate: boolean = false) => {
    if (!examId) return;
    setGenerating(true);
    setError(null);

    const toastId = toast.loading(
      forceRegenerate
        ? "AI is regenerating curriculum-aligned questions..."
        : "AI is analyzing syllabus and generating questions..."
    );

    try {
      const endpoint = forceRegenerate
        ? `${API_BASE}/api/question-papers/regenerate/${examId}`
        : `${API_BASE}/api/question-papers/generate/${examId}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ force: forceRegenerate })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate question paper.");
      }

      setQuestionPaper(data.data);
      toast.success(
        forceRegenerate
          ? "Question paper regenerated successfully!"
          : "Question paper generated successfully!",
        { id: toastId }
      );
    } catch (err) {
      console.error("AI Generation error:", err);
      const msg = err instanceof Error ? err.message : "AI generation failed. Please try again.";
      toast.error(msg, { id: toastId });
      setError(msg);
    } finally {
      setGenerating(false);
    }
  };

  // Print Question Paper
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-600">Loading Examination Paper...</p>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="container mx-auto max-w-4xl p-6 font-sans">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-600" />
          <h2 className="mt-2 text-lg font-bold text-rose-900">Unable to Load Exam</h2>
          <p className="mt-1 text-sm text-rose-700">{error}</p>
          <button
            onClick={() => router.push("/admin/allExams")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition"
          >
            <ArrowLeft size={14} /> Back to All Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-6 lg:p-8 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Print Stylesheet Overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt !important;
          }
          aside,
          header,
          nav,
          .no-print,
          .dashboard-sidebar,
          .dashboard-header {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
          }
          .question-paper-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .answer-key-box {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print mx-auto mb-6 max-w-4xl flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/allExams")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={14} /> All Exams
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              AI Question Paper Generator
            </h1>
            <p className="text-xs text-slate-500">
              {exam?.className}
              {exam?.stream ? ` (${exam.stream})` : ""} &bull; {exam?.subject}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {questionPaper && (
            <>
              <button
                type="button"
                onClick={() => setShowAnswerKey((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  showAnswerKey
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <HelpCircle size={14} />
                {showAnswerKey ? "Hide Answer Key" : "Marking Guide / Key"}
              </button>

              <button
                type="button"
                disabled={generating}
                onClick={() => handleGenerate(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition"
              >
                <RotateCcw size={14} className={generating ? "animate-spin" : ""} />
                Regenerate AI Paper
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#03204C]/80 hover:bg-[#1556a7] px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
              >
                <Printer size={14} />
                Print / Save as PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="print-container mx-auto max-w-4xl">
        {!questionPaper ? (
          /* Empty State: Prompt to Generate Question Paper */
          <div className="no-print rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-inner">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
              Generate AI Question Paper
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Generate a curriculum-aligned examination paper with Multiple Choice (MCQ), Short Answer, and Creative/Structured questions using Gemini AI.
            </p>

            {/* Exam Context Card */}
            {exam && (
              <div className="mx-auto my-6 max-w-lg rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-left text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-semibold text-slate-400">Exam Title:</span>
                    <p className="font-bold text-slate-800">{exam.examName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Class & Section:</span>
                    <p className="font-bold text-slate-800">
                      {exam.className}
                      {exam.stream ? ` (${exam.stream})` : ""} - Sec {exam.section || "A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Subject:</span>
                    <p className="font-bold text-purple-700">{exam.subject}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Total Marks:</span>
                    <p className="font-bold text-slate-800">{exam.totalMarks || 100} Marks</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={generating}
              onClick={() => handleGenerate(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#03204C]/80 hover:bg-[#1556a7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition disabled:opacity-60"
            >
              {generating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating Questions with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Question Paper Now
                </>
              )}
            </button>
          </div>
        ) : (
          /* Formal Printable Question Paper Layout */
          <div className="question-paper-card rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-slate-900">
            {/* Header / Institutional Branding */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                EduManage International School
              </h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mt-0.5">
                Annual Academic Examination Assessment
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-800 underline underline-offset-4">
                {questionPaper.examName}
              </h3>
            </div>

            {/* Exam Metadata Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-y-2 border-b border-slate-300 pb-4 text-xs font-medium text-slate-700">
              <div>
                <span className="font-bold text-slate-900">Class: </span>
                {questionPaper.className}
                {questionPaper.stream ? ` (${questionPaper.stream})` : ""}
              </div>
              <div>
                <span className="font-bold text-slate-900">Subject: </span>
                <span className="font-bold text-slate-900">{questionPaper.subject}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">Section: </span>
                {questionPaper.section || "A"}
              </div>
              <div>
                <span className="font-bold text-slate-900">Time / Duration: </span>
                {questionPaper.duration || "2 Hours 30 Minutes"}
              </div>
              <div>
                <span className="font-bold text-slate-900">Full Marks: </span>
                <span className="font-bold text-slate-900">{questionPaper.totalMarks}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">Date: </span>
                {questionPaper.examDate || new Date().toISOString().split("T")[0]}
              </div>
            </div>

            {/* General Instructions */}
            {questionPaper.generalInstructions && questionPaper.generalInstructions.length > 0 && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs italic text-slate-700">
                <span className="font-bold not-italic text-slate-900">General Instructions: </span>
                <ul className="mt-1 list-disc list-inside space-y-0.5 not-italic">
                  {questionPaper.generalInstructions.map((ins, i) => (
                    <li key={i} className="text-slate-600">{ins}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections & Questions */}
            <div className="mt-6 space-y-8">
              {questionPaper.sections && questionPaper.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-4">
                  {/* Section Title Header */}
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
                      {sec.sectionTitle || sec.title}
                    </h4>
                    {sec.sectionMarks > 0 && (
                      <span className="text-xs font-bold text-slate-700">
                        [ Marks: {sec.sectionMarks} ]
                      </span>
                    )}
                  </div>

                  {sec.instructions && (
                    <p className="text-xs italic text-slate-600 font-medium">
                      {sec.instructions}
                    </p>
                  )}

                  {/* Section Questions */}
                  <div className="space-y-5">
                    {sec.questions && sec.questions.map((q, qIdx) => (
                      <div key={qIdx} className="text-xs sm:text-sm text-slate-900">
                        {/* Question Row Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="font-bold shrink-0">{q.questionNumber || qIdx + 1}.</span>
                            <div className="font-medium leading-relaxed">{q.question || q.text}</div>
                          </div>
                          {q.marks > 0 && (
                            <span className="text-xs font-semibold text-slate-600 shrink-0 ml-2">
                              [{q.marks}]
                            </span>
                          )}
                        </div>

                        {/* MCQ Options (2x2 Grid) */}
                        {q.options && q.options.length > 0 && (
                          <div className="mt-2.5 ml-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            {q.options.map((opt, optIdx) => {
                              const optLetter = String.fromCharCode(65 + optIdx);
                              const isCorrect = showAnswerKey && q.correctOptionIndex === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-center gap-2 p-1 rounded ${
                                    isCorrect ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200" : "text-slate-700"
                                  }`}
                                >
                                  <span className="font-bold">({optLetter})</span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Creative / Structured Sub-questions */}
                        {q.subQuestions && q.subQuestions.length > 0 && (
                          <div className="mt-3 ml-6 space-y-2 text-xs sm:text-sm">
                            {q.subQuestions.map((sub, sIdx) => (
                              <div key={sIdx} className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <span className="font-bold shrink-0">({sub.label || String.fromCharCode(97 + sIdx)})</span>
                                  <span className="text-slate-800">{sub.question || sub.text}</span>
                                </div>
                                {sub.marks > 0 && (
                                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                                    [{sub.marks}]
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Teacher's Answer Key / Solution Hint (Visible only when toggled, hidden in print) */}
                        {showAnswerKey && (q.suggestedAnswer || q.correctOptionIndex !== undefined) && (
                          <div className="answer-key-box no-print mt-2 ml-6 rounded-lg bg-amber-50/70 p-2.5 border border-amber-200 text-xs text-amber-900">
                            <span className="font-bold text-amber-800">Answer Guide: </span>
                            {q.options && q.correctOptionIndex !== undefined ? (
                              <span>
                                Option ({String.fromCharCode(65 + q.correctOptionIndex)}) - {q.options[q.correctOptionIndex]}
                              </span>
                            ) : (
                              <span>{q.suggestedAnswer}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Examination Paper Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>EduManage Assessment System &bull; Confidential Examination</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

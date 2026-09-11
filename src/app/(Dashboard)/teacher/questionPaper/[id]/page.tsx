"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Settings2,
  X,
  ShieldAlert,
  Loader2,
  Lock,
  Check
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@/app/lib/auth-client";

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

interface QuestionConfigItem {
  count: number;
  marksPerQuestion: number;
}

interface QuestionConfiguration {
  mcq: QuestionConfigItem;
  short: QuestionConfigItem;
  creative: QuestionConfigItem;
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
  questionConfiguration?: QuestionConfiguration;
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
  questionConfiguration?: QuestionConfiguration;
  status: string;
  description?: string;
  createdBy?: string;
  createdByEmail?: string;
}

interface TeacherAssignment {
  _id?: string;
  id?: string;
  classId: string;
  groupId?: string;
  sectionId?: string;
  subjectId: string;
  teacherEmail?: string;
}

const defaultQuestionConfig: QuestionConfiguration = {
  mcq: { count: 20, marksPerQuestion: 1 },
  short: { count: 5, marksPerQuestion: 2 },
  creative: { count: 4, marksPerQuestion: 5 }
};

export default function TeacherQuestionPaperPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id as string;

  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaperData | null>(null);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Question Configuration State
  const [questionConfig, setQuestionConfig] = useState<QuestionConfiguration>(defaultQuestionConfig);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Calculations for Question Configuration Blueprint
  const mcqTotal = useMemo(() => {
    const c = Math.max(0, Number(questionConfig.mcq.count) || 0);
    const m = Math.max(0, Number(questionConfig.mcq.marksPerQuestion) || 0);
    return c * m;
  }, [questionConfig.mcq]);

  const shortTotal = useMemo(() => {
    const c = Math.max(0, Number(questionConfig.short.count) || 0);
    const m = Math.max(0, Number(questionConfig.short.marksPerQuestion) || 0);
    return c * m;
  }, [questionConfig.short]);

  const creativeTotal = useMemo(() => {
    const c = Math.max(0, Number(questionConfig.creative.count) || 0);
    const m = Math.max(0, Number(questionConfig.creative.marksPerQuestion) || 0);
    return c * m;
  }, [questionConfig.creative]);

  const configuredGrandTotal = useMemo(() => {
    return mcqTotal + shortTotal + creativeTotal;
  }, [mcqTotal, shortTotal, creativeTotal]);

  const targetExamMarks = Number(exam?.totalMarks) || 100;
  const marksDiff = useMemo(() => {
    return Math.abs(configuredGrandTotal - targetExamMarks);
  }, [configuredGrandTotal, targetExamMarks]);

  const isConfigMatched = useMemo(() => {
    return configuredGrandTotal === targetExamMarks;
  }, [configuredGrandTotal, targetExamMarks]);

  // Fetch Teacher Assignments
  useEffect(() => {
    async function fetchAssignments() {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API_BASE}/api/assignments?teacherEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAssignments(data.data);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    }
    fetchAssignments();
  }, [user?.email, API_BASE]);

  // Authorization check on frontend
  const isAuthorized = useMemo(() => {
    if (!exam) return false;
    // Creator is always authorized
    if (exam.createdByEmail && user?.email && exam.createdByEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    if (exam.createdBy && user?.id && String(exam.createdBy) === String(user.id)) {
      return true;
    }

    const norm = (str?: string) => (str || "").toLowerCase().replace(/[\s_-]/g, "");
    const examClassNorm = norm(exam.className);
    const examSubNorm = norm(exam.subject);
    const examStreamNorm = norm(exam.stream);
    const examSecNorm = (exam.section || "A").toUpperCase().replace("SECTION", "").trim();

    return assignments.some((a) => {
      const matchClass = norm(a.classId) === examClassNorm;
      const matchSub = !examSubNorm || examSubNorm === "allsubjects" || norm(a.subjectId) === examSubNorm;
      const matchGroup =
        !examStreamNorm ||
        norm(a.groupId) === examStreamNorm ||
        norm(a.groupId) === "general" ||
        !a.groupId ||
        a.groupId === "N/A";
      const matchSection = !a.sectionId || a.sectionId === "All" || norm(a.sectionId).toUpperCase().replace("SECTION", "").trim() === examSecNorm;

      return matchClass && matchSub && matchGroup && matchSection;
    });
  }, [exam, assignments, user]);

  // Fetch Exam and Question Paper Data
  const fetchData = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Exam Details
      const examRes = await fetch(`${API_BASE}/api/exams/${examId}`);
      const examData = await examRes.json();

      if (!examRes.ok || !examData.success) {
        throw new Error(examData.message || "Failed to load exam details.");
      }

      setExam(examData.data);

      // Pre-fill question configuration from exam if available
      if (examData.data.questionConfiguration) {
        setQuestionConfig(examData.data.questionConfiguration);
      } else {
        const t = examData.data.totalMarks || 100;
        if (t === 100) {
          setQuestionConfig({
            mcq: { count: 20, marksPerQuestion: 1 },
            short: { count: 5, marksPerQuestion: 2 },
            creative: { count: 7, marksPerQuestion: 10 }
          });
        } else if (t === 50) {
          setQuestionConfig({
            mcq: { count: 10, marksPerQuestion: 1 },
            short: { count: 5, marksPerQuestion: 2 },
            creative: { count: 3, marksPerQuestion: 10 }
          });
        } else {
          setQuestionConfig({
            mcq: { count: Math.floor(t * 0.3), marksPerQuestion: 1 },
            short: { count: Math.floor((t * 0.2) / 2), marksPerQuestion: 2 },
            creative: { count: Math.floor((t * 0.5) / 5), marksPerQuestion: 5 }
          });
        }
      }

      // 2. Fetch Existing Question Paper for this Exam
      const paperRes = await fetch(`${API_BASE}/api/question-papers/exam/${examId}`);
      const paperData = await paperRes.json();

      if (paperRes.ok && paperData.success && paperData.data) {
        const qp = paperData.data.questionPaper || paperData.data;
        if (qp && qp.sections) {
          setQuestionPaper(qp);
          if (qp.questionConfiguration) {
            setQuestionConfig(qp.questionConfiguration);
          }
        } else {
          setQuestionPaper(null);
        }
      } else {
        setQuestionPaper(null);
      }
    } catch (err) {
      console.error("Fetch question paper page error:", err);
      setError(err instanceof Error ? err.message : "Failed to load question paper data.");
    } finally {
      setLoading(false);
    }
  }, [examId, API_BASE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate / Regenerate Question Paper via AI
  const handleGenerate = async (isRegenerate = false) => {
    if (!examId) return;

    if (!isAuthorized) {
      toast.error("Forbidden: You are not authorized to generate a question paper for this examination.");
      return;
    }

    if (!isConfigMatched) {
      toast.error(
        `Configured marks total (${configuredGrandTotal}) must equal exam total marks (${targetExamMarks}).`
      );
      setShowConfigModal(true);
      return;
    }

    setGenerating(true);
    setError(null);

    const endpoint = isRegenerate
      ? `${API_BASE}/api/question-papers/regenerate/${examId}`
      : `${API_BASE}/api/question-papers/generate/${examId}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
          "x-user-role": "teacher"
        },
        body: JSON.stringify({
          questionConfiguration: questionConfig,
          teacherEmail: user?.email,
          teacherRole: "teacher",
          force: isRegenerate
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate question paper.");
      }

      setQuestionPaper(data.data);
      setShowConfigModal(false);
      toast.success(
        isRegenerate
          ? "Question paper regenerated successfully with Gemini AI!"
          : "Question paper generated successfully with Gemini AI!"
      );
    } catch (err) {
      console.error("Question paper generation error:", err);
      const errMsg = err instanceof Error ? err.message : "Error generating question paper.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 print:bg-white print:p-0">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Screen-Only Header & Action Toolbar */}
      <div className="mx-auto max-w-5xl space-y-4 mb-6 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/teacher/allExams")}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-xs"
              title="Back to All Exams"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  AI Question Paper Generator
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {exam
                  ? `${exam.examName} • ${exam.className} ${exam.stream ? `(${exam.stream})` : ""} • Sec ${exam.section || "A"} • ${exam.subject}`
                  : "Loading examination details..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Configure Blueprint Button */}
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <Settings2 size={15} className="text-purple-600" />
              <span>Blueprint Config</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isConfigMatched ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {configuredGrandTotal}/{targetExamMarks}M
              </span>
            </button>

            {/* Answer Key Toggle */}
            {questionPaper && (
              <button
                type="button"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer shadow-xs ${
                  showAnswerKey
                    ? "bg-amber-500 border-amber-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <HelpCircle size={15} />
                <span>{showAnswerKey ? "Hide Answer Key" : "View Answer Key"}</span>
              </button>
            )}

            {/* Print / Export Button */}
            {questionPaper && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-xs"
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>
            )}

            {/* Generate or Regenerate CTA */}
            {isAuthorized ? (
              <button
                type="button"
                onClick={() => handleGenerate(Boolean(questionPaper))}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-amber-300" />
                    <span>Generating with AI...</span>
                  </>
                ) : questionPaper ? (
                  <>
                    <RotateCcw size={15} className="text-amber-300" />
                    <span>Regenerate Paper</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} className="text-amber-300" />
                    <span>Generate Question Paper</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                title="You can only generate question papers for your assigned courses"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
              >
                <Lock size={15} />
                <span>Generation Restricted</span>
              </button>
            )}
          </div>
        </div>

        {/* Authorization Status Alert */}
        {!isAuthorized && exam && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-center gap-2.5 shadow-xs">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Access Restricted: </span>
              This examination is for {exam.className}{exam.stream ? ` (${exam.stream})` : ""} Section {exam.section || "A"} ({exam.subject}). You can view existing question papers, but AI generation and modification are restricted to the assigned faculty member.
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl p-4 text-sm font-medium border bg-rose-50 text-rose-800 border-rose-200">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading examination data and question blueprint...</p>
          </div>
        ) : !questionPaper ? (
          /* Empty State - Prompt user to generate question paper */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-6 print:hidden">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
              <FileText size={32} />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-slate-900">No Question Paper Generated Yet</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click below to generate a curriculum-aligned examination paper with Gemini AI according to your blueprint configuration.
              </p>
            </div>

            {/* Blueprint Overview */}
            <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Active Marks Blueprint</span>
                {isAuthorized && (
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(true)}
                    className="text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Settings2 size={13} /> Edit Config
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-800">MCQ</div>
                  <div className="text-[11px] text-slate-500">{questionConfig.mcq.count} Qs × {questionConfig.mcq.marksPerQuestion}M</div>
                  <div className="font-bold text-purple-700 mt-0.5">{mcqTotal} Marks</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-800">Short</div>
                  <div className="text-[11px] text-slate-500">{questionConfig.short.count} Qs × {questionConfig.short.marksPerQuestion}M</div>
                  <div className="font-bold text-purple-700 mt-0.5">{shortTotal} Marks</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-800">Creative</div>
                  <div className="text-[11px] text-slate-500">{questionConfig.creative.count} Qs × {questionConfig.creative.marksPerQuestion}M</div>
                  <div className="font-bold text-purple-700 mt-0.5">{creativeTotal} Marks</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <span className="font-semibold text-slate-600">Total Configured:</span>
                <span className={`font-bold ${isConfigMatched ? "text-emerald-600" : "text-amber-600"}`}>
                  {configuredGrandTotal} / {targetExamMarks} Marks
                </span>
              </div>
            </div>

            {isAuthorized && (
              <div>
                <button
                  type="button"
                  onClick={() => handleGenerate(false)}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-amber-300" />
                      <span>Crafting Examination Paper...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="text-amber-300" />
                      <span>Generate AI Question Paper</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Printable A4 Question Paper Document */
          <div className="bg-white shadow-xl rounded-2xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 text-slate-900 font-serif leading-relaxed">
            {/* School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase">EduManage Model School & College</h1>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-sans font-semibold">
                {questionPaper.academicYear || "Academic Session 2025 - 2026"}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-1">
                {questionPaper.examName}
              </h2>
            </div>

            {/* Exam Meta Info */}
            <div className="grid grid-cols-2 text-xs font-sans font-semibold py-3 border-b border-slate-300 text-slate-800 gap-y-1">
              <div>
                <span>Class: </span>
                <span className="font-bold">{questionPaper.className}</span>
                {questionPaper.stream && <span className="ml-1 font-bold">({questionPaper.stream})</span>}
                {questionPaper.section && <span className="ml-1">Sec: {questionPaper.section}</span>}
              </div>
              <div className="text-right">
                <span>Time: </span>
                <span className="font-bold">{questionPaper.duration || "2 Hours 30 Minutes"}</span>
              </div>
              <div>
                <span>Subject: </span>
                <span className="font-bold">{questionPaper.subject}</span>
              </div>
              <div className="text-right">
                <span>Full Marks: </span>
                <span className="font-bold text-slate-950">{questionPaper.totalMarks}</span>
              </div>
            </div>

            {/* General Instructions */}
            {questionPaper.generalInstructions && questionPaper.generalInstructions.length > 0 && (
              <div className="py-3 border-b border-dashed border-slate-300 text-xs font-sans text-slate-700 italic space-y-1">
                <span className="font-bold not-italic text-slate-900">General Instructions:</span>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {questionPaper.generalInstructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            <div className="py-6 space-y-8">
              {questionPaper.sections?.map((sec, secIdx) => {
                const isMcqSection = sec.title?.toLowerCase().includes("objective") || sec.title?.toLowerCase().includes("mcq") || sec.questions?.some(q => q.options && q.options.length > 0);

                return (
                  <div key={secIdx} className="space-y-4">
                    {/* Section Header */}
                    <div className="text-center font-sans">
                      <div className="inline-block border-b-2 border-slate-900 pb-0.5 px-4">
                        <span className="font-bold text-sm sm:text-base uppercase tracking-wider">
                          {sec.title || sec.sectionTitle || `Section ${String.fromCharCode(65 + secIdx)}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-600 font-semibold mt-1 px-1">
                        <span className="italic">{sec.instructions}</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded print:bg-transparent">
                          Marks: {sec.sectionMarks}
                        </span>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className={isMcqSection ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2" : "space-y-4 pt-2"}>
                      {sec.questions?.map((q, qIdx) => {
                        const qText = q.text || q.question || "";

                        return (
                          <div key={qIdx} className={`text-sm ${isMcqSection ? "space-y-1.5" : "space-y-2"} group`}>
                            {/* Question Header & Prompt */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-1.5 flex-1">
                                <span className="font-bold font-sans">{q.questionNumber || qIdx + 1}.</span>
                                <span className="leading-snug text-slate-900 font-medium">{qText}</span>
                              </div>
                              <span className="font-sans font-bold text-xs text-slate-800 shrink-0 ml-2">
                                [{q.marks}]
                              </span>
                            </div>

                            {/* MCQ Options */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-5 font-sans text-xs text-slate-800">
                                {q.options.map((opt, optIdx) => {
                                  const optLabel = String.fromCharCode(97 + optIdx); // a, b, c, d
                                  const isCorrect = showAnswerKey && q.correctOptionIndex === optIdx;

                                  return (
                                    <div
                                      key={optIdx}
                                      className={`flex items-start gap-1.5 p-1 rounded transition ${
                                        isCorrect ? "bg-emerald-100 text-emerald-950 font-bold border border-emerald-300" : ""
                                      }`}
                                    >
                                      <span className="font-semibold">({optLabel})</span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Creative / Structured Sub-questions */}
                            {q.subQuestions && q.subQuestions.length > 0 && (
                              <div className="pl-5 space-y-1.5 font-sans text-xs">
                                {q.subQuestions.map((sub, subIdx) => (
                                  <div key={subIdx} className="space-y-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-1 text-slate-800">
                                        <span className="font-bold">({sub.label || String.fromCharCode(97 + subIdx)})</span>
                                        <span>{sub.text || sub.question}</span>
                                      </div>
                                      <span className="font-bold text-slate-700 shrink-0">[{sub.marks}]</span>
                                    </div>
                                    {showAnswerKey && sub.suggestedAnswer && (
                                      <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[11px] text-amber-900 mt-1">
                                        <span className="font-bold">Suggested Solution: </span>
                                        {sub.suggestedAnswer}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Suggested Answer for Broad / Short Questions */}
                            {showAnswerKey && q.suggestedAnswer && !q.subQuestions?.length && (
                              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 font-sans mt-1">
                                <span className="font-bold">Suggested Solution: </span>
                                {q.suggestedAnswer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Document Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 text-center text-xs font-sans text-slate-500">
              <p>*** END OF QUESTION PAPER ***</p>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 print:hidden">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Settings2 className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Question Paper Blueprint</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* MCQ Config */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>1. Multiple Choice Questions (MCQ)</span>
                  <span className="text-purple-700 font-bold">{mcqTotal} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={questionConfig.mcq.count}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          mcq: { ...questionConfig.mcq, count: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Marks Per Question</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={questionConfig.mcq.marksPerQuestion}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          mcq: { ...questionConfig.mcq, marksPerQuestion: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Short Questions Config */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>2. Short Questions</span>
                  <span className="text-purple-700 font-bold">{shortTotal} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={questionConfig.short.count}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          short: { ...questionConfig.short, count: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Marks Per Question</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={questionConfig.short.marksPerQuestion}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          short: { ...questionConfig.short, marksPerQuestion: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Creative / Broad Questions Config */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>3. Creative / Broad Questions</span>
                  <span className="text-purple-700 font-bold">{creativeTotal} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={questionConfig.creative.count}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          creative: { ...questionConfig.creative, count: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Marks Per Question</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={questionConfig.creative.marksPerQuestion}
                      onChange={(e) =>
                        setQuestionConfig({
                          ...questionConfig,
                          creative: { ...questionConfig.creative, marksPerQuestion: Math.max(0, Number(e.target.value) || 0) }
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Grand Total Comparison */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  isConfigMatched
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                <div>
                  <div>Target Exam Marks: {targetExamMarks}</div>
                  <div className="font-normal text-[11px]">
                    Blueprint Sum: {mcqTotal} + {shortTotal} + {creativeTotal} = {configuredGrandTotal} Marks
                  </div>
                </div>
                <div className="text-right">
                  {isConfigMatched ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 size={14} /> Exact Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertCircle size={14} /> Difference: {marksDiff}M
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Close
              </button>
              {isAuthorized && (
                <button
                  type="button"
                  onClick={() => handleGenerate(Boolean(questionPaper))}
                  disabled={generating || !isConfigMatched}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-amber-300" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300" /> Apply & Generate Paper
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

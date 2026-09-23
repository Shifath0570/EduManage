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
  Check,
  ArrowRight,
  Calculator,
  ListOrdered
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@/app/lib/auth-client";

interface JwtResponse {
  token?: string;
  message?: string;
}

const getJwt = async (): Promise<string> => {
  const response = await fetch("/api/auth/token", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const result: JwtResponse = await response.json().catch(() => ({}));

  if (!response.ok || !result.token) {
    throw new Error(result.message || "You must be signed in to perform this action.");
  }

  return result.token;
};

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
      const token = await getJwt().catch(() => "");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (user?.email) {
        headers["x-user-email"] = user.email;
        headers["x-user-role"] = "teacher";
      }

      // 1. Fetch Exam Details
      const examRes = await fetch(`${API_BASE}/api/exams/${examId}`, { headers });
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
      const paperRes = await fetch(`${API_BASE}/api/question-papers/exam/${examId}`, { headers });
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
  }, [examId, API_BASE, user?.email]);

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
      const token = await getJwt();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 print:bg-white print:p-0">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Screen-Only Header & Action Toolbar */}
      <div className="mx-auto max-w-5xl space-y-4 mb-6 print:hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => router.push("/teacher/allExams")}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              title="Back to All Exams"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
                  <Sparkles className="h-4 w-4 fill-white text-white" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                  AI Question Paper Generator
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                {exam ? (
                  <>
                    <span className="font-bold text-slate-800">{exam.examName}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200/80">
                      {exam.className} {exam.stream ? `(${exam.stream})` : ""}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-md border border-teal-200/80">
                      Sec {exam.section || "A"}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{exam.subject}</span>
                  </>
                ) : (
                  <span>Loading examination details...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Configure Blueprint Button */}
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-emerald-200/80 text-emerald-700 hover:bg-emerald-50/60 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Settings2 size={15} className="text-emerald-600" />
              <span>Blueprint Config</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  isConfigMatched
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300/80"
                    : "bg-amber-50 text-amber-800 border-amber-300/80"
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                  showAnswerKey
                    ? "bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-500/20"
                    : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#03204C] hover:bg-[#1556a7] text-white transition-all cursor-pointer shadow-md shadow-slate-900/10 active:scale-[0.98]"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs px-5 py-2.5 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <Sparkles size={15} className="fill-amber-300 text-amber-300" />
                    <span>Generate Question Paper</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                title="You can only generate question papers for your assigned courses"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-200 text-slate-400 cursor-not-allowed"
              >
                <Lock size={15} />
                <span>Generation Restricted</span>
              </button>
            )}
          </div>
        </div>

        {/* Authorization Status Alert */}
        {!isAuthorized && exam && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-amber-950">Access Restricted</span>
              <p className="text-amber-800 leading-relaxed">
                This examination is for <strong>{exam.className}{exam.stream ? ` (${exam.stream})` : ""} Section {exam.section || "A"} ({exam.subject})</strong>.
                You can view existing question papers, but AI generation and blueprint modifications are restricted to the assigned faculty member.
              </p>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border bg-rose-50 text-rose-800 border-rose-200 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Loading Examination Blueprint</h3>
              <p className="text-xs text-slate-500 mt-1">Retrieving curriculum structures and existing question papers...</p>
            </div>
          </div>
        ) : !questionPaper ? (
          /* Empty State - Prompt user to generate question paper */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs space-y-8 print:hidden">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600/10 via-emerald-500/15 to-emerald-400/20 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
              <FileText size={36} />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Question Paper Generated Yet</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure your question structure below and click Generate to create an institutional, curriculum-aligned examination paper with Gemini AI.
              </p>
            </div>

            {/* Visual Blueprint Flow: Type -> Count -> Marks -> Total */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white p-5 sm:p-6 text-left space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="fill-emerald-500 text-emerald-500" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Question Paper Blueprint Breakdown
                  </span>
                </div>
                {isAuthorized && (
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition hover:underline"
                  >
                    <Settings2 size={13} /> Edit Config
                  </button>
                )}
              </div>

              {/* 3 Step Config Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. MCQ Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">1. MCQ / Objective</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {mcqTotal} Marks
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <strong className="text-slate-800">{questionConfig.mcq.count} Qs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Marks per Q:</span>
                      <strong className="text-slate-800">{questionConfig.mcq.marksPerQuestion} Mark</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.mcq.count} × {questionConfig.mcq.marksPerQuestion} = {mcqTotal}M
                  </div>
                </div>

                {/* 2. Short Questions Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">2. Short Questions</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {shortTotal} Marks
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <strong className="text-slate-800">{questionConfig.short.count} Qs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Marks per Q:</span>
                      <strong className="text-slate-800">{questionConfig.short.marksPerQuestion} Marks</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.short.count} × {questionConfig.short.marksPerQuestion} = {shortTotal}M
                  </div>
                </div>

                {/* 3. Creative / Broad Questions Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">3. Creative / Broad</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {creativeTotal} Marks
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <strong className="text-slate-800">{questionConfig.creative.count} Qs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Marks per Q:</span>
                      <strong className="text-slate-800">{questionConfig.creative.marksPerQuestion} Marks</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.creative.count} × {questionConfig.creative.marksPerQuestion} = {creativeTotal}M
                  </div>
                </div>
              </div>

              {/* Total Summary Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs font-bold">
                <div className="text-slate-600">
                  Target Exam Total: <span className="font-extrabold text-slate-900">{targetExamMarks} Marks</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                  isConfigMatched
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                    : "bg-amber-50 text-amber-900 border-amber-200/80"
                }`}>
                  {isConfigMatched ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Blueprint matches Exam Total ({configuredGrandTotal}M)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>Difference: {marksDiff} Marks {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isAuthorized && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate(false)}
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-amber-300" />
                      <span>Crafting Examination Paper with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="fill-amber-300 text-amber-300" />
                      <span>Generate AI Question Paper</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Printable A4 Question Paper Document */
          <div className="bg-white shadow-xl rounded-3xl border border-slate-200/80 p-8 sm:p-14 print:shadow-none print:border-none print:p-0 text-slate-900 font-serif leading-relaxed">
            {/* School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase font-serif">
                EduManage Model School & College
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-sans font-bold">
                {questionPaper.academicYear || "Academic Session 2025 - 2026"}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-1 font-serif">
                {questionPaper.examName}
              </h2>
            </div>

            {/* Exam Meta Info */}
            <div className="grid grid-cols-2 text-xs font-sans font-semibold py-3.5 border-b border-slate-300 text-slate-800 gap-y-1.5">
              <div>
                <span className="text-slate-500">Class: </span>
                <span className="font-bold text-slate-900">{questionPaper.className}</span>
                {questionPaper.stream && <span className="ml-1 font-bold text-slate-900">({questionPaper.stream})</span>}
                {questionPaper.section && <span className="ml-1 text-slate-700">• Sec: {questionPaper.section}</span>}
              </div>
              <div className="text-right">
                <span className="text-slate-500">Time: </span>
                <span className="font-bold text-slate-900">{questionPaper.duration || "2 Hours 30 Minutes"}</span>
              </div>
              <div>
                <span className="text-slate-500">Subject: </span>
                <span className="font-bold text-slate-900">{questionPaper.subject}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Full Marks: </span>
                <span className="font-extrabold text-slate-950">{questionPaper.totalMarks}</span>
              </div>
            </div>

            {/* General Instructions */}
            {questionPaper.generalInstructions && questionPaper.generalInstructions.length > 0 && (
              <div className="py-3.5 border-b border-dashed border-slate-300 text-xs font-sans text-slate-700 italic space-y-1 bg-slate-50/50 p-3 rounded-xl my-3 print:bg-transparent print:p-0">
                <span className="font-bold not-italic text-slate-900">General Instructions:</span>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] not-italic text-slate-600">
                  {questionPaper.generalInstructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            <div className="py-6 space-y-8">
              {questionPaper.sections?.map((sec, secIdx) => {
                const isMcqSection =
                  sec.title?.toLowerCase().includes("objective") ||
                  sec.title?.toLowerCase().includes("mcq") ||
                  sec.questions?.some((q) => q.options && q.options.length > 0);

                return (
                  <div key={secIdx} className="space-y-4">
                    {/* Section Header */}
                    <div className="text-center font-sans">
                      <div className="inline-block border-b-2 border-slate-900 pb-0.5 px-4">
                        <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-900">
                          {sec.title || sec.sectionTitle || `Section ${String.fromCharCode(65 + secIdx)}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-600 font-semibold mt-2 px-1">
                        <span className="italic">{sec.instructions}</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md print:bg-transparent">
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
                                <span className="font-bold font-sans text-slate-900">{q.questionNumber || qIdx + 1}.</span>
                                <span className="leading-snug text-slate-900 font-medium">{qText}</span>
                              </div>
                              <span className="font-sans font-bold text-xs text-slate-800 shrink-0 ml-2 bg-slate-50 px-1.5 py-0.5 rounded print:bg-transparent">
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
                                      className={`flex items-start gap-1.5 p-1 rounded-lg transition ${
                                        isCorrect ? "bg-emerald-100 text-emerald-950 font-bold border border-emerald-300" : ""
                                      }`}
                                    >
                                      <span className="font-semibold text-slate-600">({optLabel})</span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Creative / Structured Sub-questions */}
                            {q.subQuestions && q.subQuestions.length > 0 && (
                              <div className="pl-5 space-y-2 font-sans text-xs">
                                {q.subQuestions.map((sub, subIdx) => (
                                  <div key={subIdx} className="space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-1.5 text-slate-800">
                                        <span className="font-bold text-slate-900">({sub.label || String.fromCharCode(97 + subIdx)})</span>
                                        <span>{sub.text || sub.question}</span>
                                      </div>
                                      <span className="font-bold text-slate-700 shrink-0">[{sub.marks}]</span>
                                    </div>
                                    {showAnswerKey && sub.suggestedAnswer && (
                                      <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 mt-1 space-y-0.5">
                                        <span className="font-bold">Suggested Solution: </span>
                                        <p>{sub.suggestedAnswer}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Suggested Answer for Broad / Short Questions */}
                            {showAnswerKey && q.suggestedAnswer && !q.subQuestions?.length && (
                              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 font-sans mt-1">
                                <span className="font-bold">Suggested Solution: </span>
                                <p className="mt-0.5">{q.suggestedAnswer}</p>
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
            <div className="mt-10 pt-4 border-t border-slate-300 text-center text-xs font-sans text-slate-400 uppercase tracking-wider font-semibold">
              <p>*** END OF QUESTION PAPER ***</p>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-xs">
                  <Settings2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Question Paper Blueprint</h3>
                  <p className="text-xs text-slate-500">Configure exact question count and marks per category.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visual Guide: Question Type -> Number -> Marks per Q -> Total */}
            <div className="space-y-4 text-xs">
              {/* MCQ Config Card */}
              <div className="p-4 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white rounded-2xl border border-emerald-200/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black">1</span>
                    <span>Multiple Choice Questions (MCQ)</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                    {mcqTotal} Marks
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Number of Questions</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Marks Per Question</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center font-semibold pt-1 border-t border-emerald-100/60">
                  {questionConfig.mcq.count} Questions × {questionConfig.mcq.marksPerQuestion} Marks = {mcqTotal} Marks
                </div>
              </div>

              {/* Short Questions Config Card */}
              <div className="p-4 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white rounded-2xl border border-emerald-200/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black">2</span>
                    <span>Short Questions</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                    {shortTotal} Marks
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Number of Questions</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Marks Per Question</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center font-semibold pt-1 border-t border-emerald-100/60">
                  {questionConfig.short.count} Questions × {questionConfig.short.marksPerQuestion} Marks = {shortTotal} Marks
                </div>
              </div>

              {/* Creative / Broad Questions Config Card */}
              <div className="p-4 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white rounded-2xl border border-emerald-200/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black">3</span>
                    <span>Creative / Broad Questions</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                    {creativeTotal} Marks
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Number of Questions</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Marks Per Question</label>
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
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center font-semibold pt-1 border-t border-emerald-100/60">
                  {questionConfig.creative.count} Questions × {questionConfig.creative.marksPerQuestion} Marks = {creativeTotal} Marks
                </div>
              </div>

              {/* Grand Total Comparison */}
              <div
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-xs ${
                  isConfigMatched
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200/90"
                    : "bg-amber-50 text-amber-900 border-amber-200/90"
                }`}
              >
                <div>
                  <div className="text-sm font-extrabold">Target Exam Marks: {targetExamMarks}M</div>
                  <div className="font-medium text-[11px] text-slate-600 mt-0.5">
                    Blueprint Sum: {mcqTotal} (MCQ) + {shortTotal} (Short) + {creativeTotal} (Creative) ={" "}
                    <strong>{configuredGrandTotal} Marks</strong>
                  </div>
                </div>
                <div>
                  {isConfigMatched ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 rounded-xl border border-emerald-300 shadow-2xs">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Exact Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-900 rounded-xl border border-amber-300 shadow-2xs">
                      <AlertCircle size={14} className="text-amber-600" /> Difference: {marksDiff}M {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Close
              </button>
              {isAuthorized && (
                <button
                  type="button"
                  onClick={() => handleGenerate(Boolean(questionPaper))}
                  disabled={generating || !isConfigMatched}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-amber-300" /> Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="fill-amber-300 text-amber-300" /> Apply & Generate Paper
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

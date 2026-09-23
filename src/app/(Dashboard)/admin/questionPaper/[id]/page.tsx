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
  Loader2,
  Check,
  ArrowRight,
  Calculator,
  ListOrdered
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

interface QuestionConfigItem {
  count: number;
  marksPerQuestion: number;
  totalMarks?: number;
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
}

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
    throw new Error(result.message || "You must be signed in to manage question papers.");
  }

  return result.token;
};

const defaultQuestionConfig: QuestionConfiguration = {
  mcq: { count: 20, marksPerQuestion: 1 },
  short: { count: 5, marksPerQuestion: 2 },
  creative: { count: 4, marksPerQuestion: 5 }
};

export default function AdminQuestionPaperPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaperData | null>(null);
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

  // Fetch Exam and Question Paper Data
  const fetchData = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getJwt();

      const res = await fetch(`${API_BASE}/api/question-papers/exam/${examId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load examination question paper.");
      }

      const fetchedExam: ExamInfo = data.data.exam;
      const fetchedPaper: QuestionPaperData | null = data.data.questionPaper;

      setExam(fetchedExam);
      setQuestionPaper(fetchedPaper);

      // Initialize question configuration from paper, exam, or smart defaults
      if (fetchedPaper?.questionConfiguration) {
        setQuestionConfig(fetchedPaper.questionConfiguration);
      } else if (fetchedExam?.questionConfiguration && fetchedExam.questionConfiguration.mcq) {
        setQuestionConfig(fetchedExam.questionConfiguration);
      } else {
        const total = fetchedExam?.totalMarks || 100;
        if (total === 100) {
          setQuestionConfig({
            mcq: { count: 20, marksPerQuestion: 1 },
            short: { count: 6, marksPerQuestion: 5 },
            creative: { count: 5, marksPerQuestion: 10 }
          });
        } else if (total === 50) {
          setQuestionConfig({
            mcq: { count: 20, marksPerQuestion: 1 },
            short: { count: 5, marksPerQuestion: 2 },
            creative: { count: 4, marksPerQuestion: 5 }
          });
        } else {
          setQuestionConfig({
            mcq: { count: Math.floor(total * 0.4), marksPerQuestion: 1 },
            short: { count: Math.floor((total * 0.3) / 2), marksPerQuestion: 2 },
            creative: { count: Math.floor((total * 0.3) / 5), marksPerQuestion: 5 }
          });
        }
      }
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

  const handleQuestionConfigChange = (
    sectionKey: "mcq" | "short" | "creative",
    field: "count" | "marksPerQuestion",
    val: number
  ) => {
    setQuestionConfig((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: Math.max(0, val)
      }
    }));
  };

  // Generate Question Paper with AI
  const handleGenerate = async (forceRegenerate: boolean = false) => {
    if (!examId) return;

    if (!isConfigMatched) {
      const direction = configuredGrandTotal > targetExamMarks ? "exceeded" : "missing";
      toast.error(
        `Question paper total must equal exam total marks (${targetExamMarks}). Configured Total: ${configuredGrandTotal} (${marksDiff} marks ${direction}).`
      );
      setShowConfigModal(true);
      return;
    }

    if (configuredGrandTotal === 0) {
      toast.error("Please configure at least one question section with count > 0.");
      return;
    }

    setGenerating(true);
    setError(null);

    const toastId = toast.loading(
      forceRegenerate
        ? "AI is regenerating examination questions following your blueprint..."
        : "AI is crafting question paper following your exact blueprint..."
    );

    try {
      const endpoint = forceRegenerate
        ? `${API_BASE}/api/question-papers/regenerate/${examId}`
        : `${API_BASE}/api/question-papers/generate/${examId}`;

      const payload = {
        force: forceRegenerate,
        questionConfiguration: {
          mcq: {
            count: Number(questionConfig.mcq.count),
            marksPerQuestion: Number(questionConfig.mcq.marksPerQuestion),
            totalMarks: mcqTotal
          },
          short: {
            count: Number(questionConfig.short.count),
            marksPerQuestion: Number(questionConfig.short.marksPerQuestion),
            totalMarks: shortTotal
          },
          creative: {
            count: Number(questionConfig.creative.count),
            marksPerQuestion: Number(questionConfig.creative.marksPerQuestion),
            totalMarks: creativeTotal
          }
        }
      };

      const token = await getJwt();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate question paper.");
      }

      setQuestionPaper(data.data);
      if (data.data.questionConfiguration) {
        setQuestionConfig(data.data.questionConfiguration);
      }
      setShowConfigModal(false);

      toast.success(
        forceRegenerate
          ? "Question paper regenerated successfully with Gemini AI!"
          : "Question paper generated successfully with Gemini AI!",
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

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800 print:bg-white print:p-0">
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

      {/* Screen-Only Header & Action Toolbar */}
      <div className="no-print mx-auto max-w-5xl space-y-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => router.push("/admin/allExams")}
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
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border bg-rose-50 text-rose-800 border-rose-200 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="print-container mx-auto max-w-4xl">
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
          /* Empty State - Prompt user to configure structure & generate */
          <div className="no-print bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs space-y-8">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600/10 via-emerald-500/15 to-emerald-400/20 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
              <FileText size={36} />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Question Paper Generated Yet</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Define the question blueprint below and generate an institutional, curriculum-aligned examination paper with Gemini AI.
              </p>
            </div>

            {/* Exam Context Summary Cards */}
            {exam && (
              <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-400">Exam Title</span>
                  <p className="font-bold text-slate-800 truncate">{exam.examName}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-400">Class & Section</span>
                  <p className="font-bold text-slate-800">
                    {exam.className} {exam.stream ? `(${exam.stream})` : ""} - Sec {exam.section || "A"}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-400">Subject</span>
                  <p className="font-bold text-emerald-700">{exam.subject}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-400">Target Marks</span>
                  <p className="font-bold text-slate-800">{exam.totalMarks} Marks</p>
                </div>
              </div>
            )}

            {/* Visual Blueprint Flow: Type -> Count -> Marks -> Total */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white p-5 sm:p-6 text-left space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="fill-emerald-500 text-emerald-500" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Question Paper Blueprint Breakdown
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition hover:underline"
                >
                  <Settings2 size={13} /> Customize Inputs
                </button>
              </div>

              {/* 3 Step Config Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. MCQ Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">1. MCQ / Objective</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {mcqTotal} Marks
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Number of Questions</label>
                      <input
                        type="number"
                        min={0}
                        value={questionConfig.mcq.count}
                        onChange={(e) => handleQuestionConfigChange("mcq", "count", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.mcq.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("mcq", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.mcq.count} × {questionConfig.mcq.marksPerQuestion} = {mcqTotal} Marks
                  </div>
                </div>

                {/* 2. Short Questions Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">2. Short Questions</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {shortTotal} Marks
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Number of Questions</label>
                      <input
                        type="number"
                        min={0}
                        value={questionConfig.short.count}
                        onChange={(e) => handleQuestionConfigChange("short", "count", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.short.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("short", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.short.count} × {questionConfig.short.marksPerQuestion} = {shortTotal} Marks
                  </div>
                </div>

                {/* 3. Creative / Broad Questions Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">3. Creative / Broad</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                      {creativeTotal} Marks
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Number of Questions</label>
                      <input
                        type="number"
                        min={0}
                        value={questionConfig.creative.count}
                        onChange={(e) => handleQuestionConfigChange("creative", "count", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.creative.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("creative", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 transition"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-center text-emerald-700 bg-emerald-50/50 rounded-lg py-1">
                    {questionConfig.creative.count} × {questionConfig.creative.marksPerQuestion} = {creativeTotal} Marks
                  </div>
                </div>
              </div>

              {/* Total Summary Row & Validation */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs font-bold">
                <div className="text-slate-600">
                  Target Exam Total: <span className="font-extrabold text-slate-900">{targetExamMarks} Marks</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                    isConfigMatched
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                      : "bg-amber-50 text-amber-900 border-amber-200/80"
                  }`}
                >
                  {isConfigMatched ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Blueprint matches Exam Total ({configuredGrandTotal}M)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>
                        Difference: {marksDiff} Marks {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Generation CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={generating || !isConfigMatched || configuredGrandTotal === 0}
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
                    <span>Generate AI Question Paper ({configuredGrandTotal} Marks)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Printable / Formal Institutional Question Paper Layout */
          <div className="question-paper-card bg-white shadow-xl rounded-3xl border border-slate-200/80 p-8 sm:p-14 print:shadow-none print:border-none print:p-0 text-slate-900 font-serif leading-relaxed">
            {/* Header / Institutional Branding */}
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

            {/* Exam Metadata Grid */}
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

            {/* Sections & Questions */}
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
                        return (
                          <div key={qIdx} className="text-xs sm:text-sm text-slate-900">
                            {/* Question Row */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="font-bold font-sans shrink-0">{q.questionNumber || qIdx + 1}.</span>
                                <div className="font-medium leading-relaxed">{q.question || q.text}</div>
                              </div>
                              {q.marks > 0 && (
                                <span className="text-xs font-semibold text-slate-600 shrink-0 font-sans ml-2">
                                  [{q.marks}]
                                </span>
                              )}
                            </div>

                            {/* MCQ Options Grid */}
                            {q.options && q.options.length > 0 && (
                              <div className="mt-2.5 ml-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-sans">
                                {q.options.map((opt, optIdx) => {
                                  const optLetter = String.fromCharCode(65 + optIdx);
                                  const isCorrect = showAnswerKey && q.correctOptionIndex === optIdx;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`flex items-center gap-2 p-1.5 rounded-lg transition ${
                                        isCorrect
                                          ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-2xs"
                                          : "text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                      <span className="font-bold text-slate-500">({optLetter})</span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Creative / Structured Sub-questions */}
                            {q.subQuestions && q.subQuestions.length > 0 && (
                              <div className="mt-3 ml-6 space-y-2 text-xs sm:text-sm font-sans">
                                {q.subQuestions.map((sub, sIdx) => (
                                  <div key={sIdx} className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                      <span className="font-bold shrink-0">
                                        ({sub.label || String.fromCharCode(97 + sIdx)})
                                      </span>
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

                            {/* Answer Key / Solution Hint */}
                            {showAnswerKey && (q.suggestedAnswer || q.correctOptionIndex !== undefined) && (
                              <div className="answer-key-box no-print mt-3 ml-6 rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 text-xs text-amber-950 font-sans shadow-2xs">
                                <span className="font-bold text-amber-800">Answer Key: </span>
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Examination Paper Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] font-sans text-slate-400">
              <span>EduManage Assessment System &bull; Confidential Examination</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Edit & Re-generation Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-xs">
                  <Settings2 className="h-4 w-4 text-white" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Configure Question Blueprint</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Specify the exact number of questions and marks per question. The AI will strictly craft questions matching this structure.
            </p>

            <div className="space-y-3">
              {/* MCQ Config Item */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">MCQ / Objective</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.mcq.count}
                      onChange={(e) => handleQuestionConfigChange("mcq", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.mcq.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("mcq", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-emerald-700 w-16 text-right">{mcqTotal} M</div>
              </div>

              {/* Short Config Item */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">Short Questions</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.short.count}
                      onChange={(e) => handleQuestionConfigChange("short", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.short.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("short", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-emerald-700 w-16 text-right">{shortTotal} M</div>
              </div>

              {/* Creative Config Item */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">Creative / Broad</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.creative.count}
                      onChange={(e) => handleQuestionConfigChange("creative", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.creative.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("creative", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-emerald-700 w-16 text-right">{creativeTotal} M</div>
              </div>
            </div>

            {/* Validation Feedback Banner */}
            <div
              className={`rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2.5 border ${
                isConfigMatched
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                  : "bg-rose-50 text-rose-800 border-rose-200/80"
              }`}
            >
              {isConfigMatched ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>
                {isConfigMatched ? (
                  <>Total matches exam: {configuredGrandTotal} / {targetExamMarks} Marks</>
                ) : (
                  <>
                    Total must equal {targetExamMarks} Marks. Current: {configuredGrandTotal} ({marksDiff} marks{" "}
                    {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}).
                  </>
                )}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={generating || !isConfigMatched || configuredGrandTotal === 0}
                onClick={() => handleGenerate(Boolean(questionPaper))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <RotateCcw size={14} />
                )}
                <span>{questionPaper ? "Regenerate With Blueprint" : "Apply & Generate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

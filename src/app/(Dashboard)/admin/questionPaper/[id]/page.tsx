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
  X
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

const defaultQuestionConfig: QuestionConfiguration = {
  mcq: { count: 20, marksPerQuestion: 1 },
  short: { count: 5, marksPerQuestion: 2 },
  creative: { count: 4, marksPerQuestion: 5 }
};

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
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Question Configuration State
  const [questionConfig, setQuestionConfig] = useState<QuestionConfiguration>(defaultQuestionConfig);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Calculations for Question Configuration
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
      const res = await fetch(`${API_BASE}/api/question-papers/exam/${examId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load examination question paper.");
      }

      const fetchedExam: ExamInfo = data.data.exam;
      const fetchedPaper: QuestionPaperData | null = data.data.questionPaper;

      setExam(fetchedExam);
      setQuestionPaper(fetchedPaper);

      // Initialize question configuration from paper, exam, or defaults
      if (fetchedPaper?.questionConfiguration) {
        setQuestionConfig(fetchedPaper.questionConfiguration);
      } else if (fetchedExam?.questionConfiguration && fetchedExam.questionConfiguration.mcq) {
        setQuestionConfig(fetchedExam.questionConfiguration);
      } else {
        // Compute smart defaults based on exam total marks
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
        ? "AI is strictly generating new questions using your configuration..."
        : "AI is generating questions according to your exact structure..."
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

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
          ? "Question paper regenerated successfully according to structure!"
          : "Question paper generated successfully according to structure!",
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
              {exam?.stream ? ` (${exam.stream})` : ""} &bull; {exam?.subject} &bull; {exam?.totalMarks} Marks
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {questionPaper && (
            <>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <Settings2 size={14} className="text-purple-600" />
                Configure Blueprint
              </button>

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
                {showAnswerKey ? "Hide Answer Key" : "Marking Guide"}
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
                Print / Save PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="print-container mx-auto max-w-4xl">
        {!questionPaper ? (
          /* Empty State: Admin Configures Structure Before AI Generation */
          <div className="no-print rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-inner">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                Configure & Generate Question Paper
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Define the exact number of questions and marks for each section. The AI will strictly follow your blueprint.
              </p>
            </div>

            {/* Exam Context Summary Bar */}
            {exam && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="font-semibold text-slate-400">Exam Title:</span>
                  <p className="font-bold text-slate-800">{exam.examName}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Class & Group:</span>
                  <p className="font-bold text-slate-800">
                    {exam.className} {exam.stream ? `(${exam.stream})` : ""} - Sec {exam.section || "A"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Subject:</span>
                  <p className="font-bold text-purple-700">{exam.subject}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Exam Total Marks:</span>
                  <p className="font-bold text-slate-800">{exam.totalMarks} Marks</p>
                </div>
              </div>
            )}

            {/* Question Paper Configuration Section */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-5 md:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Question Paper Structure Configuration</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500">Configured Total: </span>
                  <span className={`text-sm font-extrabold ${isConfigMatched ? "text-emerald-700" : "text-purple-700"}`}>
                    {configuredGrandTotal} Marks
                  </span>
                </div>
              </div>

              {/* 3 Section Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MCQ / Objective */}
                <div className="rounded-xl bg-white p-4 border border-purple-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">MCQ / Objective</span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-100">
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
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.mcq.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("mcq", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 text-center font-medium pt-1 border-t border-slate-50">
                    {questionConfig.mcq.count} × {questionConfig.mcq.marksPerQuestion} = {mcqTotal} Marks
                  </div>
                </div>

                {/* Short Questions */}
                <div className="rounded-xl bg-white p-4 border border-purple-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Short Questions</span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-100">
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
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.short.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("short", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 text-center font-medium pt-1 border-t border-slate-50">
                    {questionConfig.short.count} × {questionConfig.short.marksPerQuestion} = {shortTotal} Marks
                  </div>
                </div>

                {/* Creative / Broad Questions */}
                <div className="rounded-xl bg-white p-4 border border-purple-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Creative / Broad</span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-100">
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
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Marks Per Question</label>
                      <input
                        type="number"
                        min={1}
                        value={questionConfig.creative.marksPerQuestion}
                        onChange={(e) => handleQuestionConfigChange("creative", "marksPerQuestion", Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 text-center font-medium pt-1 border-t border-slate-50">
                    {questionConfig.creative.count} × {questionConfig.creative.marksPerQuestion} = {creativeTotal} Marks
                  </div>
                </div>
              </div>

              {/* Validation Feedback */}
              <div
                className={`rounded-xl p-3.5 text-xs font-medium flex items-center gap-2 border ${
                  isConfigMatched
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                {isConfigMatched ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                )}
                <span>
                  {isConfigMatched ? (
                    <>
                      Configuration matches Exam Total Marks:{" "}
                      <strong>
                        MCQ ({mcqTotal}) + Short ({shortTotal}) + Creative ({creativeTotal}) = {configuredGrandTotal} Marks
                      </strong>
                    </>
                  ) : (
                    <>
                      Question paper total must equal exam total marks. Exam Total:{" "}
                      <strong>{targetExamMarks}</strong> | Configured Total:{" "}
                      <strong>{configuredGrandTotal}</strong> | Difference:{" "}
                      <strong>
                        {marksDiff} marks {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}
                      </strong>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Generation CTA Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                disabled={generating || !isConfigMatched || configuredGrandTotal === 0}
                onClick={() => handleGenerate(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#03204C]/80 hover:bg-[#1556a7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating Questions According to Blueprint...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Question Paper ({configuredGrandTotal} Marks)
                  </>
                )}
              </button>
            </div>
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

      {/* Blueprint Edit & Re-generation Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Settings2 className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Configure Question Blueprint</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Update the question counts and marks per question. Regenerating will create new questions matching this exact specification.
            </p>

            <div className="space-y-3">
              {/* MCQ */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">MCQ / Objective</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.mcq.count}
                      onChange={(e) => handleQuestionConfigChange("mcq", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.mcq.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("mcq", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-purple-700 w-16 text-right">{mcqTotal} M</div>
              </div>

              {/* Short Questions */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">Short Questions</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.short.count}
                      onChange={(e) => handleQuestionConfigChange("short", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.short.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("short", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-purple-700 w-16 text-right">{shortTotal} M</div>
              </div>

              {/* Creative Questions */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3 text-xs">
                <div className="font-bold text-slate-800 w-28">Creative / Broad</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      value={questionConfig.creative.count}
                      onChange={(e) => handleQuestionConfigChange("creative", "count", Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={questionConfig.creative.marksPerQuestion}
                      onChange={(e) => handleQuestionConfigChange("creative", "marksPerQuestion", Number(e.target.value))}
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>
                <div className="font-extrabold text-purple-700 w-16 text-right">{creativeTotal} M</div>
              </div>
            </div>

            {/* Validation Banner */}
            <div
              className={`rounded-xl p-3 text-xs font-medium flex items-center gap-2 border ${
                isConfigMatched
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              {isConfigMatched ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>
                {isConfigMatched ? (
                  <>Total matches: {configuredGrandTotal} / {targetExamMarks} Marks</>
                ) : (
                  <>
                    Total must equal {targetExamMarks} Marks. Current: {configuredGrandTotal} ({marksDiff} marks {configuredGrandTotal > targetExamMarks ? "exceeded" : "missing"}).
                  </>
                )}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={generating || !isConfigMatched || configuredGrandTotal === 0}
                onClick={() => handleGenerate(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 px-4 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-50"
              >
                <RotateCcw size={14} className={generating ? "animate-spin" : ""} />
                Regenerate With Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, FormEvent, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, Spinner } from "@heroui/react";
import {
  Calendar,
  ChevronDown,
  Plus,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Clock,
  ArrowRight
} from "lucide-react";

interface ExamFormData {
  examName: string;
  examType: string;
  className: string;
  stream: string;
  section: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  duration: string;
  status: string;
  description: string;
}

const CLASS_SUBJECTS_MAP: Record<string, string[]> = {
  class_1: ["Bangla", "English", "Mathematics"],
  class_2: ["Bangla", "English", "Mathematics"],
  class_3: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_4: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_5: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_6: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_7: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_8: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_9_science: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics"
  ],
  class_9_businessStudies: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Accounting",
    "Business Entrepreneurship",
    "Finance and Banking",
    "General Science"
  ],
  class_9_humanities: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "History of Bangladesh and World Civilization",
    "Geography and Environment",
    "Civics and Citizenship",
    "Economics"
  ],
  class_10_science: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics"
  ],
  class_10_businessStudies: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Accounting",
    "Business Entrepreneurship",
    "Finance and Banking",
    "General Science"
  ],
  class_10_humanities: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "History of Bangladesh and World Civilization",
    "Geography and Environment",
    "Civics and Citizenship",
    "Economics"
  ]
};

const initialFormData: ExamFormData = {
  examName: "",
  examType: "Mid Term",
  className: "",
  stream: "",
  section: "A",
  subject: "",
  totalMarks: 100,
  passMarks: 40,
  examDate: new Date().toISOString().split("T")[0],
  duration: "2 Hours 30 Minutes",
  status: "Active",
  description: ""
};

const sectionOptions = ["A", "B", "C"];

const classOptions = [
  { label: "Class 1", value: "Class 1" },
  { label: "Class 2", value: "Class 2" },
  { label: "Class 3", value: "Class 3" },
  { label: "Class 4", value: "Class 4" },
  { label: "Class 5", value: "Class 5" },
  { label: "Class 6", value: "Class 6" },
  { label: "Class 7", value: "Class 7" },
  { label: "Class 8", value: "Class 8" },
  { label: "Class 9", value: "Class 9" },
  { label: "Class 10", value: "Class 10" }
];

const groupOptions = [
  { label: "Science", value: "Science" },
  { label: "Business Studies", value: "Business" },
  { label: "Humanities", value: "Humanities" }
];

interface QuestionConfigItem {
  count: number;
  marksPerQuestion: number;
}

interface QuestionConfiguration {
  mcq: QuestionConfigItem;
  short: QuestionConfigItem;
  creative: QuestionConfigItem;
}

const initialQuestionConfig: QuestionConfiguration = {
  mcq: { count: 20, marksPerQuestion: 1 },
  short: { count: 5, marksPerQuestion: 2 },
  creative: { count: 4, marksPerQuestion: 5 }
};

export default function AdminCreateExam() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [questionConfig, setQuestionConfig] = useState<QuestionConfiguration>(initialQuestionConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [lastCreatedExam, setLastCreatedExam] = useState<{
    _id: string;
    examName: string;
    className: string;
    stream?: string;
    subject: string;
    section: string;
  } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Check if current class supports Group / Stream selection
  const requiresGroup = useMemo(() => {
    return formData.className === "Class 9" || formData.className === "Class 10";
  }, [formData.className]);

  // Question Paper Configuration calculations
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

  const marksDiff = useMemo(() => {
    return Math.abs(configuredGrandTotal - Number(formData.totalMarks));
  }, [configuredGrandTotal, formData.totalMarks]);

  const isConfigMatched = useMemo(() => {
    return configuredGrandTotal === Number(formData.totalMarks);
  }, [configuredGrandTotal, formData.totalMarks]);

  // Compute valid subjects based on Class and Group (matching source of truth)
  const availableSubjects = useMemo(() => {
    if (!formData.className) return [];

    if (requiresGroup) {
      if (!formData.stream) return [];
      const classNum = formData.className === "Class 9" ? "9" : "10";
      const groupLower = formData.stream.toLowerCase();
      const groupKey =
        groupLower.includes("science") ? "science" :
        groupLower.includes("business") ? "businessStudies" :
        groupLower.includes("humanities") ? "humanities" : "";

      if (!groupKey) return [];
      return CLASS_SUBJECTS_MAP[`class_${classNum}_${groupKey}`] || [];
    }

    const classNum = formData.className.replace(/\D/g, "");
    return CLASS_SUBJECTS_MAP[`class_${classNum}`] || [];
  }, [formData.className, formData.stream, requiresGroup]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === "totalMarks" || name === "passMarks" ? Number(value) : value
      };

      // When Class changes:
      if (name === "className") {
        updated.stream = ""; // Always reset group
        updated.subject = ""; // Always reset subject
      }

      // When Group changes:
      if (name === "stream") {
        updated.subject = ""; // Reset subject when group changes
      }

      return updated;
    });
  };

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

  const handleSyncTotalMarks = () => {
    setFormData((prev) => ({
      ...prev,
      totalMarks: configuredGrandTotal
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    setLastCreatedExam(null);

    if (!formData.examName.trim()) {
      setFeedback({ type: "error", message: "Please enter an Exam Name." });
      return;
    }

    if (!formData.className) {
      setFeedback({ type: "error", message: "Please select a target Class." });
      return;
    }

    if (requiresGroup && !formData.stream) {
      setFeedback({
        type: "error",
        message: `Please select a Group (Science, Business, or Humanities) for ${formData.className}.`
      });
      return;
    }

    if (!formData.subject) {
      setFeedback({ type: "error", message: "Please select a valid Subject for this examination." });
      return;
    }

    if (!formData.section) {
      setFeedback({ type: "error", message: "Please select a target Section." });
      return;
    }

    if (!formData.examDate) {
      setFeedback({ type: "error", message: "Please select an Exam Date." });
      return;
    }

    if (formData.passMarks > formData.totalMarks) {
      setFeedback({ type: "error", message: "Pass Marks cannot exceed Total Marks." });
      return;
    }

    // Validate Question Configuration against Exam Total Marks
    if (!isConfigMatched) {
      const direction = configuredGrandTotal > formData.totalMarks ? "exceeded" : "missing";
      setFeedback({
        type: "error",
        message: `Question paper total must equal the exam total marks. Exam Total: ${formData.totalMarks} | Configured Total: ${configuredGrandTotal} | Difference: ${marksDiff} marks ${direction}.`
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (configuredGrandTotal === 0) {
      setFeedback({
        type: "error",
        message: "Question paper configuration must have at least one question section with count > 0."
      });
      return;
    }

    setLoading(true);

    const payload = {
      examName: formData.examName.trim(),
      examType: formData.examType,
      className: formData.className,
      section: formData.section,
      stream: requiresGroup ? formData.stream : null,
      subject: formData.subject,
      totalMarks: Number(formData.totalMarks),
      passMarks: Number(formData.passMarks),
      examDate: formData.examDate,
      duration: formData.duration || "2 Hours 30 Minutes",
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
      },
      status: formData.status,
      description: formData.description
    };

    try {
      const res = await fetch(`${API_BASE}/api/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create exam record.");
      }

      const streamLabel = data.data.stream ? ` (${data.data.stream})` : "";
      setFeedback({
        type: "success",
        message: `Exam "${data.data.examName}" created successfully for ${data.data.className}${streamLabel} - ${data.data.subject} (Section ${data.data.section || formData.section})!`
      });

      setLastCreatedExam({
        _id: data.data._id,
        examName: data.data.examName,
        className: data.data.className,
        stream: data.data.stream,
        subject: data.data.subject,
        section: data.data.section || formData.section
      });

      setFormData(initialFormData);
      setQuestionConfig(initialQuestionConfig);

      // Smooth scroll to top of page to see success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred while creating the exam.";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 font-sans">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Award className="h-5 w-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#081838]">
              Create Exam
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Schedule a new examination session for classes and configure subjects dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/allExams")}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition border border-purple-200/60"
          >
            <BookOpen className="h-4 w-4 text-purple-600" />
            View All Exams
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/enterMarks")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            <BookOpen className="h-4 w-4 text-slate-500" />
            Go to Enter Marks
          </button>
        </div>
      </div>

      {/* Feedback Banner & AI Question Paper CTA */}
      {feedback && (
        <div
          className={`mb-6 rounded-2xl p-5 border shadow-sm transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50/90 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm">{feedback.message}</p>
              
              {feedback.type === "success" && lastCreatedExam && (
                <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-200/80">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/questionPaper/${lastCreatedExam._id}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Generate Question Paper (AI)
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/allExams")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition border border-slate-200"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                    View in All Exams
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <Card className="border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs rounded-2xl">
        <CardHeader className="mb-6 p-0 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="h-5 w-5 text-[#6348eb]" />
            <h2 className="text-lg font-bold text-[#081838]">
              Examination Details & Subject Configuration
            </h2>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Exam Name */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Exam Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="examName"
                placeholder="e.g. Mid Term Examination 2026, Final Assessment"
                value={formData.examName}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
              />
            </div>

            {/* Target Class */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Target Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                >
                  <option value="" disabled>Select target class</option>
                  {classOptions.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Dynamic Group / Stream Selection (Only for Class 9 & Class 10) */}
            {requiresGroup ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>
                    Group / Stream <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    Required for {formData.className}
                  </span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl bg-purple-50/30 border border-purple-200 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                  >
                    <option value="" disabled>Select Group (Science / Business / Humanities)</option>
                    {groupOptions.map((grp) => (
                      <option key={grp.value} value={grp.value}>
                        {grp.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            ) : (
              /* Target Section when group is not applicable to keep grid balanced */
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Target Section <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                  >
                    {sectionOptions.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            {/* Target Section (shown when requiresGroup is true) */}
            {requiresGroup && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Target Section <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                  >
                    {sectionOptions.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            {/* Dynamic Subject Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>
                  Subject <span className="text-red-500">*</span>
                </span>
                {availableSubjects.length > 0 && (
                  <span className="text-[10px] font-semibold text-slate-500">
                    {availableSubjects.length} subjects available
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={!formData.className || (requiresGroup && !formData.stream)}
                  className={`w-full appearance-none rounded-xl border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20 ${
                    !formData.className || (requiresGroup && !formData.stream)
                      ? "bg-slate-100 cursor-not-allowed opacity-70 text-slate-400"
                      : "bg-slate-50/70"
                  }`}
                >
                  <option value="" disabled>
                    {!formData.className
                      ? "First select target class..."
                      : requiresGroup && !formData.stream
                      ? "First select group..."
                      : "Select subject..."}
                  </option>
                  {availableSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Exam Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Exam Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                >
                  <option value="Mid Term">Mid Term Examination</option>
                  <option value="Final">Final Examination</option>
                  <option value="Class Test">Class Test</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Other">Other Assessment</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Exam Date */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Exam Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20 [color-scheme:light]"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Exam Duration */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Exam Duration / Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  name="duration"
                  placeholder="e.g. 2 Hours 30 Minutes, 3 Hours, 1 Hour"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                />
                <Clock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Total Marks */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min={1}
                max={1000}
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
              />
            </div>

            {/* Pass Marks */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Pass Marks <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min={0}
                max={formData.totalMarks}
                name="passMarks"
                value={formData.passMarks}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Status
              </label>
              <div className="flex gap-4">
                {(["Active", "Upcoming", "Completed"] as const).map((st) => (
                  <label key={st} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value={st}
                      checked={formData.status === st}
                      onChange={handleInputChange}
                      className="accent-[#6348eb]"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Description / Notes
              </label>
              <textarea
                rows={3}
                name="description"
                placeholder="Add optional notes, exam rules, or room arrangements..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20 resize-none"
              />
            </div>
          </div>

          {/* Question Paper Configuration Section (AI Blueprint) */}
          <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50/30 p-5 md:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Question Paper Structure Configuration
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define the exact question count and marks. AI will strictly follow this structure.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Configured Total:</span>{" "}
                <span className={`text-sm font-extrabold ${isConfigMatched ? "text-emerald-700" : "text-purple-700"}`}>
                  {configuredGrandTotal} Marks
                </span>
              </div>
            </div>

            {/* 3 Section Config Cards */}
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

            {/* Validation Feedback & Sync CTA */}
            <div
              className={`rounded-xl p-3.5 text-xs font-medium flex flex-wrap items-center justify-between gap-3 border ${
                isConfigMatched
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {isConfigMatched ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                )}
                <span>
                  {isConfigMatched ? (
                    <>
                      Question paper configuration matches Exam Total Marks:{" "}
                      <strong>
                        MCQ ({mcqTotal}) + Short ({shortTotal}) + Creative ({creativeTotal}) = {configuredGrandTotal} Marks
                      </strong>
                    </>
                  ) : (
                    <>
                      Question paper total must equal the exam total marks. Exam Total:{" "}
                      <strong>{formData.totalMarks}</strong> | Configured Total:{" "}
                      <strong>{configuredGrandTotal}</strong> | Difference:{" "}
                      <strong>
                        {marksDiff} marks {configuredGrandTotal > formData.totalMarks ? "exceeded" : "missing"}
                      </strong>
                    </>
                  )}
                </span>
              </div>

              {!isConfigMatched && (
                <button
                  type="button"
                  onClick={handleSyncTotalMarks}
                  className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs font-semibold shadow-xs transition"
                >
                  Set Exam Total to {configuredGrandTotal} Marks
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Reset Form
            </button>
            <Button
              type="submit"
              isDisabled={loading || !formData.className || (requiresGroup && !formData.stream) || !formData.subject}
              className="font-semibold text-white shadow-md shadow-purple-500/20 bg-[#03204C]/80 hover:bg-[#1556a7]"
            >
              {loading ? (
                <Spinner size="sm" color="current" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1 inline" />
                  Save Exam
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
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
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Info
} from "lucide-react";
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

interface TeacherAssignment {
  _id?: string;
  id?: string;
  classId: string;
  groupId?: string;
  sectionId?: string;
  subjectId: string;
  teacherEmail?: string;
  teacherName?: string;
  status?: string;
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

const initialQuestionConfig: QuestionConfiguration = {
  mcq: { count: 20, marksPerQuestion: 1 },
  short: { count: 5, marksPerQuestion: 2 },
  creative: { count: 4, marksPerQuestion: 5 }
};

const sectionOptions = ["A", "B", "C", "D"];

// Normalizes Class format for display and selection
const formatClassName = (classId: string) => {
  if (!classId) return "";
  const match = String(classId).match(/\d+/);
  return match ? `Class ${match[0]}` : classId;
};

// Normalizes Group format for display and selection
const formatGroupName = (groupId: string) => {
  if (!groupId || groupId === "N/A" || groupId.toLowerCase() === "general") return "";
  const lower = groupId.toLowerCase();
  if (lower.includes("science")) return "Science";
  if (lower.includes("business") || lower.includes("commerce")) return "Business";
  if (lower.includes("humanities") || lower.includes("arts")) return "Humanities";
  return groupId;
};

// Normalizes Section format (e.g. "sec-a", "SEC-A", "Section A" -> "A")
const formatSectionName = (sec?: string) => {
  if (!sec) return "A";
  return String(sec).toUpperCase().replace(/^SECTION[\s_-]*/i, "").replace(/^SEC[\s_-]*/i, "").trim() || "A";
};

export default function TeacherCreateExam() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [questionConfig, setQuestionConfig] = useState<QuestionConfiguration>(initialQuestionConfig);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [lastCreatedExam, setLastCreatedExam] = useState<{
    _id: string;
    examName: string;
    className: string;
    subject: string;
  } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Teacher's active assignments
  useEffect(() => {
    async function fetchTeacherAssignments() {
      if (!user?.email) {
        setLoadingAssignments(false);
        return;
      }

      setLoadingAssignments(true);
      try {
        const res = await fetch(`${API_BASE}/api/assignments?teacherEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAssignments(data.data);

          // Auto-prefill the form with the teacher's primary assigned Class, Group, and Subject
          const firstAssign = data.data[0];
          const autoClass = formatClassName(firstAssign.classId);
          const autoGroup = formatGroupName(firstAssign.groupId || "");
          const autoSub = firstAssign.subjectId || "";
          const autoSec = formatSectionName(firstAssign.sectionId);

          setFormData((prev) => ({
            ...prev,
            className: autoClass,
            stream: autoGroup,
            subject: autoSub,
            section: autoSec
          }));
        } else {
          setAssignments([]);
        }
      } catch (err) {
        console.error("Failed to load teacher assignments:", err);
      } finally {
        setLoadingAssignments(false);
      }
    }

    fetchTeacherAssignments();
  }, [user?.email, API_BASE]);

  // Derive unique assigned classes available to this teacher
  const authorizedClasses = useMemo(() => {
    const classSet = new Set<string>();
    assignments.forEach((a) => {
      const formatted = formatClassName(a.classId);
      if (formatted) classSet.add(formatted);
    });
    return Array.from(classSet);
  }, [assignments]);

  // Derive unique assigned groups available for the currently selected class
  const authorizedGroups = useMemo(() => {
    if (!formData.className) return [];
    const groupSet = new Set<string>();
    assignments.forEach((a) => {
      if (formatClassName(a.classId) === formData.className) {
        const grp = formatGroupName(a.groupId || "");
        if (grp) groupSet.add(grp);
      }
    });
    return Array.from(groupSet);
  }, [assignments, formData.className]);

  // Derive unique assigned subjects for currently selected class and group
  const authorizedSubjects = useMemo(() => {
    if (!formData.className) return [];
    const subSet = new Set<string>();
    assignments.forEach((a) => {
      const matchClass = formatClassName(a.classId) === formData.className;
      const grp = formatGroupName(a.groupId || "");
      const matchGroup = !formData.stream || !grp || grp === formData.stream;
      if (matchClass && matchGroup && a.subjectId) {
        subSet.add(a.subjectId);
      }
    });
    return Array.from(subSet);
  }, [assignments, formData.className, formData.stream]);

  // Check if selected class is Class 9 or Class 10 (requires group)
  const isSSCClass = useMemo(() => {
    return formData.className === "Class 9" || formData.className === "Class 10";
  }, [formData.className]);

  // Calculations for Question Configuration Blueprint
  const mcqTotal = useMemo(() => {
    const count = Math.max(0, Number(questionConfig.mcq.count) || 0);
    const marks = Math.max(0, Number(questionConfig.mcq.marksPerQuestion) || 0);
    return count * marks;
  }, [questionConfig.mcq]);

  const shortTotal = useMemo(() => {
    const count = Math.max(0, Number(questionConfig.short.count) || 0);
    const marks = Math.max(0, Number(questionConfig.short.marksPerQuestion) || 0);
    return count * marks;
  }, [questionConfig.short]);

  const creativeTotal = useMemo(() => {
    const count = Math.max(0, Number(questionConfig.creative.count) || 0);
    const marks = Math.max(0, Number(questionConfig.creative.marksPerQuestion) || 0);
    return count * marks;
  }, [questionConfig.creative]);

  const configuredGrandTotal = useMemo(() => {
    return mcqTotal + shortTotal + creativeTotal;
  }, [mcqTotal, shortTotal, creativeTotal]);

  const targetExamMarks = Number(formData.totalMarks) || 100;
  const marksDiff = useMemo(() => {
    return Math.abs(configuredGrandTotal - targetExamMarks);
  }, [configuredGrandTotal, targetExamMarks]);

  const isConfigMatched = useMemo(() => {
    return configuredGrandTotal === targetExamMarks;
  }, [configuredGrandTotal, targetExamMarks]);

  // Handle Form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // When class changes, update available group/subject automatically
      if (name === "className") {
        const matchingAssign = assignments.find((a) => formatClassName(a.classId) === value);
        if (matchingAssign) {
          updated.stream = formatGroupName(matchingAssign.groupId || "");
          updated.subject = matchingAssign.subjectId || "";
          if (matchingAssign.sectionId) {
            updated.section = formatSectionName(matchingAssign.sectionId);
          }
        } else {
          updated.stream = "";
          updated.subject = "";
        }
      }

      // When group changes for SSC class, update subject
      if (name === "stream") {
        const matchingAssign = assignments.find(
          (a) => formatClassName(a.classId) === prev.className && formatGroupName(a.groupId || "") === value
        );
        if (matchingAssign) {
          updated.subject = matchingAssign.subjectId || "";
        }
      }

      return updated;
    });
  };

  // Sync Total Marks with Blueprint Grand Total
  const handleSyncMarks = () => {
    setFormData((prev) => ({
      ...prev,
      totalMarks: configuredGrandTotal
    }));
  };

  // Submit and Create Exam
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    // Client-side Validations
    if (!formData.examName.trim()) {
      setFeedback({ type: "error", message: "Please enter an Examination Title." });
      return;
    }

    if (!formData.className) {
      setFeedback({ type: "error", message: "Please select an assigned Target Class." });
      return;
    }

    if (isSSCClass && !formData.stream) {
      setFeedback({
        type: "error",
        message: `Please select your assigned Group for ${formData.className}.`
      });
      return;
    }

    if (!formData.subject) {
      setFeedback({ type: "error", message: "Please select your assigned Subject." });
      return;
    }

    if (formData.passMarks > formData.totalMarks) {
      setFeedback({
        type: "error",
        message: "Pass marks cannot exceed the total marks of the examination."
      });
      return;
    }

    if (!isConfigMatched) {
      setFeedback({
        type: "error",
        message: `Question Paper Configuration total (${configuredGrandTotal} Marks) does not match Exam Total Marks (${targetExamMarks} Marks). Please adjust the question structure or sync the total.`
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        examName: formData.examName.trim(),
        examType: formData.examType,
        className: formData.className,
        stream: isSSCClass ? formData.stream : null,
        section: formatSectionName(formData.section),
        subject: formData.subject,
        totalMarks: Number(formData.totalMarks),
        passMarks: Number(formData.passMarks),
        examDate: formData.examDate,
        duration: formData.duration,
        questionConfiguration: questionConfig,
        status: formData.status,
        description: formData.description,
        teacherEmail: user?.email,
        teacherRole: "teacher",
        createdByEmail: user?.email,
        createdByName: user?.name,
        createdByRole: "teacher"
      };

      const token = await getJwt();
      const res = await fetch(`${API_BASE}/api/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-user-email": user?.email || "",
          "x-user-role": "teacher"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create examination schedule.");
      }

      setFeedback({
        type: "success",
        message: `Examination "${data.data.examName}" created successfully for ${data.data.className}${data.data.stream ? ` (${data.data.stream})` : ""} - ${data.data.subject}!`
      });

      setLastCreatedExam({
        _id: data.data._id,
        examName: data.data.examName,
        className: data.data.className,
        subject: data.data.subject
      });

      // Reset form but retain teacher's assigned defaults
      setFormData((prev) => ({
        ...initialFormData,
        className: prev.className,
        stream: prev.stream,
        subject: prev.subject,
        section: prev.section
      }));
    } catch (err) {
      console.error("Create Exam Error:", err);
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to connect to backend server."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
                <Award className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
                Create Examination Schedule
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Schedule new examinations and configure curriculum question paper blueprints for your assigned classes.
            </p>
          </div>
        </div>

        {/* Informational Teacher Scope Alert */}
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/70 p-4 text-xs text-teal-950 flex items-start gap-3 shadow-xs">
          <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm text-teal-950">Teacher Assignment Scoped Creation</span>
            <p className="text-teal-900 leading-relaxed">
              As a faculty member, you can create examinations <strong>only for the Class, Group/Department, and Subject assigned to you</strong>.
              All other classes and subjects are restricted on both frontend and backend.
            </p>
            {assignments.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-2 items-center">
                <span className="font-semibold text-teal-900">Your Active Assignments:</span>
                {assignments.map((a, i) => (
                  <span
                    key={a._id || i}
                    className="inline-flex items-center gap-1 bg-white border border-teal-200/80 px-2.5 py-0.5 rounded-full font-bold text-teal-950 text-[11px] shadow-2xs"
                  >
                    <UserCheck size={12} className="text-teal-600" />
                    {formatClassName(a.classId)}
                    {formatGroupName(a.groupId || "") ? ` (${formatGroupName(a.groupId || "")})` : ""}
                    {" • "}{a.subjectId}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* AI Question Paper CTA Banner after Exam Creation */}
        {lastCreatedExam && (
          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20">
                <Sparkles className="h-5 w-5 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Exam Scheduled: {lastCreatedExam.examName}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Generate an institutional, curriculum-aligned examination paper with Gemini AI according to your configured blueprint.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/teacher/questionPaper/${lastCreatedExam._id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 transition active:scale-[0.98] cursor-pointer shrink-0"
            >
              <span>Generate AI Question Paper</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* No Assigned Courses Warning */}
        {!loadingAssignments && assignments.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center space-y-2">
            <ShieldAlert className="h-8 w-8 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold text-amber-950">No Teaching Assignments Found</h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              You currently have no classes or subjects assigned in the system. Please contact your school administrator to assign your courses before creating examinations.
            </p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Exam General Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Examination Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Exam Title */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Exam Title / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="examName"
                  required
                  placeholder="e.g. 1st Mid Term Examination 2026"
                  value={formData.examName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                  >
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final">Final Examination</option>
                    <option value="Class Test">Class Test</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Scope (Restricted to Teacher Assignment) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Target Academic Scope (Assigned Courses)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Target Class (Only Assigned Classes) */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Target Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {loadingAssignments ? (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                      <Spinner size="sm" color="accent" /> Loading assigned classes...
                    </div>
                  ) : authorizedClasses.length <= 1 ? (
                    <input
                      type="text"
                      readOnly
                      value={formData.className || "No assigned class"}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        name="className"
                        required
                        value={formData.className}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                      >
                        <option value="">Select Assigned Class</option>
                        {authorizedClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </>
                  )}
                </div>
              </div>

              {/* Group/Department for Class 9 & 10 (Only Assigned Group) */}
              {isSSCClass && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Group / Stream <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {authorizedGroups.length <= 1 ? (
                      <input
                        type="text"
                        readOnly
                        value={formData.stream || "Assigned Group"}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none cursor-not-allowed"
                      />
                    ) : (
                      <>
                        <select
                          name="stream"
                          required
                          value={formData.stream}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                        >
                          <option value="">Select Assigned Group</option>
                          {authorizedGroups.map((grp) => (
                            <option key={grp} value={grp}>
                              {grp}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Section */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                  >
                    {sectionOptions.map((sec) => (
                      <option key={sec} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Subject (Only Assigned Subjects) */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {authorizedSubjects.length <= 1 ? (
                    <input
                      type="text"
                      readOnly
                      value={formData.subject || "No assigned subject"}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none cursor-not-allowed"
                    />
                  ) : (
                    <>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer"
                      >
                        <option value="">Select Assigned Subject</option>
                        {authorizedSubjects.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Schedule & Marks Configuration */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Schedule & Marks
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Exam Date */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Exam Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="examDate"
                    required
                    value={formData.examDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 cursor-pointer [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 2 Hours 30 Minutes"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  min={10}
                  max={500}
                  required
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>

              {/* Pass Marks */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Pass Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="passMarks"
                  min={1}
                  max={formData.totalMarks}
                  required
                  value={formData.passMarks}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Question Paper Blueprint Configuration */}
          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-600 via-emerald-500 to-emerald-400 text-white shadow-xs">
                  <Sparkles className="h-4 w-4 fill-white text-white" />
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Question Paper Blueprint Structure
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Define the question paper structure. AI generation will strictly follow this configuration.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* MCQ Config */}
              <div className="rounded-xl border border-emerald-100/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">1. MCQ / Objective</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                    Total: {mcqTotal}M
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. of Questions
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Marks Per Question
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Short Questions Config */}
              <div className="rounded-xl border border-emerald-100/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">2. Short Questions</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                    Total: {shortTotal}M
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. of Questions
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Marks Per Question
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Creative / Broad Questions Config */}
              <div className="rounded-xl border border-emerald-100/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">3. Creative / Broad</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                    Total: {creativeTotal}M
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. of Questions
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Marks Per Question
                    </label>
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Comparison & Validation Banner */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5 text-xs font-bold border transition ${
                isConfigMatched
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <div>
                <div>
                  Blueprint Grand Total: {mcqTotal} (MCQ) + {shortTotal} (Short) + {creativeTotal} (Creative) ={" "}
                  <span className="underline">{configuredGrandTotal} Marks</span>
                </div>
                <div className="text-[11px] font-normal text-slate-600 mt-0.5">
                  Target Exam Total Marks: <span className="font-semibold">{targetExamMarks} Marks</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConfigMatched ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                    <CheckCircle2 size={14} /> Total Matches Exam Marks
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                      <AlertCircle size={14} /> Mismatch: {marksDiff} Mark{marksDiff > 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={handleSyncMarks}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      Set Exam Total to {configuredGrandTotal}M
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 5: Description & Instructions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <label className="block text-xs font-semibold text-slate-700">
              Exam Description & Syllabus Instructions (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="e.g. Covers Chapters 1 to 5. Scientific calculators are permitted for mathematics and science sections."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || assignments.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm px-6 py-2.5 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Scheduling Examination...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Save Exam</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

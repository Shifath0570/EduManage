"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
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
  FileText,
  Clock,
  Layers
} from "lucide-react";

interface ExamFormData {
  examName: string;
  examType: string;
  className: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  status: string;
  description: string;
}

const initialFormData: ExamFormData = {
  examName: "",
  examType: "Mid Term",
  className: "",
  subject: "All Subjects",
  totalMarks: 100,
  passMarks: 40,
  examDate: new Date().toISOString().split("T")[0],
  status: "Active",
  description: ""
};

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

const subjectOptions = [
  "All Subjects",
  "Mathematics",
  "English",
  "Bangla",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Social Science",
  "Accounting",
  "General"
];

export default function AdminCreateExam() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalMarks" || name === "passMarks" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.examName.trim()) {
      setFeedback({ type: "error", message: "Please enter an Exam Name." });
      return;
    }

    if (!formData.className) {
      setFeedback({ type: "error", message: "Please select a target Class." });
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

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create exam record.");
      }

      setFeedback({
        type: "success",
        message: `Exam "${data.data.examName}" created successfully for ${data.data.className}!`
      });

      setFormData(initialFormData);

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
            Schedule a new examination session for classes and set mark configurations.
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

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium border shadow-xs ${
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
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}

      {/* Main Form Card */}
      <Card className="border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs rounded-2xl">
        <CardHeader className="mb-6 p-0 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="h-5 w-5 text-[#6348eb]" />
            <h2 className="text-lg font-bold text-[#081838]">
              Examination Details & Configuration
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

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Subject Scope
              </label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                >
                  {subjectOptions.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
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
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-[#6348eb] focus:bg-white focus:ring-2 focus:ring-[#6348eb]/20"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
              isDisabled={loading}
              className="bg-[#03204c] font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-[#5238d6]"
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

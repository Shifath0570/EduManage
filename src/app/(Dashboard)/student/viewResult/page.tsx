"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
  Award,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  FileText,
  RotateCcw,
  Loader2,
  HelpCircle,
  XCircle,
  User,
  Hash,
  School
} from "lucide-react";
import { Chip, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";

interface SubjectResult {
  _id: string;
  examId?: string | null;
  examName: string;
  examType: string;
  examDate?: string;
  subject: string;
  className: string;
  section: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  gpa: number;
  remarks?: string;
  createdAt?: string;
}

interface ExamGroup {
  examName: string;
  examType: string;
  examDate?: string;
  examId?: string | null;
  totalMarks: number;
  obtainedMarks: number;
  totalSubjects: number;
  percentage: number;
  gpa: number;
  grade: string;
  isPassed: boolean;
  subjects: SubjectResult[];
}

interface StudentInfo {
  _id: string;
  studentId?: string;
  name: string;
  roll: string;
  className: string;
  section: string;
  email?: string;
  profileImage?: string;
}

interface ResultSummary {
  totalSubjects: number;
  totalMarks: number;
  obtainedMarks: number;
  overallPercentage: number;
  overallGpa: number;
  overallGrade: string;
  isPassed: boolean;
}

const EXAM_TYPE_OPTIONS = [
  { id: "All", label: "All Exams", badge: "Overview" },
  { id: "Final", label: "Final Exam", badge: "Annual" },
  { id: "Mid Term", label: "Midterm Exam", badge: "Term" },
  { id: "Class Test", label: "Class Test", badge: "Assessment" },
  { id: "Quiz", label: "Quiz", badge: "Weekly" }
];

export default function StudentViewResultPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [summary, setSummary] = useState<ResultSummary>({
    totalSubjects: 0,
    totalMarks: 0,
    obtainedMarks: 0,
    overallPercentage: 0,
    overallGpa: 0,
    overallGrade: "F",
    isPassed: false
  });
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [groupedExams, setGroupedExams] = useState<ExamGroup[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<string>("All");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Student Results automatically for logged in user
  const fetchResults = useCallback(
    async (examTypeFilter: string = "All") => {
      if (!user?.email && !user?.id) {
        if (!isSessionPending) {
          setLoading(false);
          setError("Please sign in to view your academic results.");
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (user.email) queryParams.set("email", user.email);
        if (user.id) queryParams.set("userId", user.id);
        if (examTypeFilter && examTypeFilter !== "All") {
          queryParams.set("examType", examTypeFilter);
        }

        const res = await fetch(`${API_BASE}/api/marks/my-results?${queryParams.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          // If profile lookup returns 404, fallback to checking student by-user endpoint
          if (res.status === 404) {
            throw new Error(data.message || "Student profile record not found for your account.");
          }
          throw new Error(data.message || "Failed to load examination results.");
        }

        setStudent(data.student || null);
        setSummary(
          data.summary || {
            totalSubjects: 0,
            totalMarks: 0,
            obtainedMarks: 0,
            overallPercentage: 0,
            overallGpa: 0,
            overallGrade: "F",
            isPassed: false
          }
        );
        setResults(data.results || []);
        setGroupedExams(data.groupedByExam || []);
      } catch (err: unknown) {
        console.error("Error loading results:", err);
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [user?.email, user?.id, isSessionPending, API_BASE]
  );

  useEffect(() => {
    fetchResults(selectedExamType);
  }, [fetchResults, selectedExamType]);

  // Color helper for letter grades
  const getGradeBadge = (grade?: string) => {
    switch ((grade || "").toUpperCase()) {
      case "A+":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "A":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "A-":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "B":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "C":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "D":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "F":
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#03204C] via-[#0B386C] to-[#1E4D8C] p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-200 text-xs font-semibold">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>Academic Performance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              My Results
            </h1>
            <p className="text-sm text-blue-100/90 max-w-xl">
              View your exam performance and subject-wise results.
            </p>
          </div>

          {/* Student Profile Identity Chip */}
          {student && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <Avatar className="h-11 w-11 ring-2 ring-white/40">
                {student.profileImage && (
                  <AvatarImage src={student.profileImage} alt={student.name} />
                )}
                <AvatarFallback className="bg-amber-400 font-bold text-[#03204C]">
                  {student.name?.charAt(0).toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-white text-sm">{student.name}</span>
                <span className="text-blue-200 font-medium">
                  {student.className} • Section {student.section}
                </span>
                <span className="text-blue-300 font-mono text-[11px]">
                  Roll: {student.roll} {student.studentId ? `| ID: ${student.studentId}` : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Exam Type Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            <Layers className="h-4 w-4 text-[#03204C]" />
            <span>Select Exam Type:</span>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {EXAM_TYPE_OPTIONS.map((opt) => {
              const isActive = selectedExamType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedExamType(opt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#03204C] text-white shadow-sm ring-2 ring-[#03204C]/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-semibold text-white">
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="w-full min-h-[380px] bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center justify-center space-y-4 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#03204C]">
            <Loader2 className="h-7 w-7 animate-spin text-[#03204C]" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-800">Loading Academic Results</h3>
            <p className="text-xs text-slate-500">
              Retrieving subject marks and computing your GPA metrics...
            </p>
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="w-full bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Result Retrieval Notice</h3>
            <p className="text-xs text-slate-600">{error}</p>
          </div>
          <button
            onClick={() => fetchResults(selectedExamType)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#03204C] text-white rounded-xl text-xs font-semibold hover:bg-[#1556a7] transition cursor-pointer"
          >
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      ) : results.length === 0 ? (
        /* Empty Results State */
        <div className="w-full min-h-[360px] bg-white rounded-2xl border border-slate-200/80 p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 border border-slate-200 text-slate-400 shadow-inner">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">
              No results available for {selectedExamType === "All" ? "any exam" : selectedExamType} yet.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Marks have not been published for this category yet. When faculty members finalize and
              publish your examination scores, they will appear here automatically.
            </p>
          </div>
          {selectedExamType !== "All" && (
            <button
              onClick={() => setSelectedExamType("All")}
              className="px-4 py-2 bg-[#03204C] text-white rounded-xl text-xs font-semibold hover:bg-[#1556a7] transition cursor-pointer"
            >
              View All Exams
            </button>
          )}
        </div>
      ) : (
        /* Results Content */
        <div className="space-y-6">
          {/* Result Summary Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* GPA Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-400">Overall GPA</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    {summary.overallGpa.toFixed(2)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getGradeBadge(summary.overallGrade)}`}>
                    {summary.overallGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-400">Percentage</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {summary.overallPercentage}%
                </span>
              </div>
            </div>

            {/* Total Marks Obtained */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-400">Marks Obtained</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700">
                    {summary.obtainedMarks}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / {summary.totalMarks}
                  </span>
                </div>
              </div>
            </div>

            {/* Status / Subjects */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                  summary.isPassed
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}
              >
                {summary.isPassed ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-400">
                  {summary.totalSubjects} {summary.totalSubjects === 1 ? "Subject" : "Subjects"}
                </span>
                <span
                  className={`text-sm sm:text-base font-bold mt-0.5 uppercase tracking-wide ${
                    summary.isPassed ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {summary.isPassed ? "Passed" : "Needs Improvement"}
                </span>
              </div>
            </div>
          </div>

          {/* Exam-Wise Breakdown Section */}
          <div className="space-y-6">
            {groupedExams.map((examGroup, gIdx) => {
              return (
                <div
                  key={examGroup.examName + gIdx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                  {/* Exam Card Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          {examGroup.examName}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#03204C]/10 text-[#03204C] border border-[#03204C]/20">
                          {examGroup.examType || "Examination"}
                        </span>
                        {examGroup.examDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {examGroup.examDate}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {examGroup.totalSubjects} {examGroup.totalSubjects === 1 ? "subject" : "subjects"} evaluated
                      </p>
                    </div>

                    {/* Exam Score Summary Badge */}
                    <div className="flex items-center gap-3">
                      <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Total Score
                        </span>
                        <span className="text-sm font-black text-slate-800">
                          {examGroup.obtainedMarks} / {examGroup.totalMarks} ({examGroup.percentage}%)
                        </span>
                      </div>

                      <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Exam GPA
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            {examGroup.gpa.toFixed(2)}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getGradeBadge(
                            examGroup.grade
                          )}`}
                        >
                          {examGroup.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Results Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4">Subject Name</th>
                          <th className="py-3 px-4 text-center">Total Marks</th>
                          <th className="py-3 px-4 text-center">Obtained Marks</th>
                          <th className="py-3 px-4 text-center">Percentage</th>
                          <th className="py-3 px-4 text-center">Grade</th>
                          <th className="py-3 px-4 text-center">Grade Point</th>
                          <th className="py-3 px-4 text-right">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {examGroup.subjects.map((sub, sIdx) => {
                          const isFail = sub.grade === "F" || sub.gpa === 0;

                          return (
                            <tr key={sub._id || sIdx} className="hover:bg-slate-50/50 transition">
                              <td className="py-3.5 px-4 text-center text-xs font-medium text-slate-400">
                                {sIdx + 1}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-[#03204C]/70" />
                                  <span>{sub.subject}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center font-semibold text-slate-600">
                                {sub.totalMarks}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`font-black ${
                                    isFail ? "text-rose-600" : "text-emerald-700"
                                  }`}
                                >
                                  {sub.marksObtained}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="font-semibold text-slate-700 text-xs">
                                    {sub.percentage}%
                                  </span>
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        isFail ? "bg-rose-500" : "bg-emerald-500"
                                      }`}
                                      style={{ width: `${Math.min(100, sub.percentage)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getGradeBadge(
                                    sub.grade
                                  )}`}
                                >
                                  {sub.grade}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                                {sub.gpa.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-4 text-right text-xs text-slate-500 font-medium">
                                {sub.remarks || (isFail ? "Needs Improvement" : "Good Progress")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  AlertCircle,
  Filter,
  ChevronDown,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Printer,
  Lock,
  Check,
  ShieldAlert
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

interface ExamOption {
  _id?: string;
  examName: string;
  className: string;
  stream?: string;
  group?: string;
  section?: string;
  subject?: string;
  totalMarks?: number;
  passMarks?: number;
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

interface StudentItem {
  _id?: string;
  studentId: string;
  name: string;
  roll: string;
  className: string;
  stream?: string;
  section: string;
}

interface ResultRecord {
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  stream?: string;
  section: string;
  exam: string;
  subject: string;
  marksObtained?: number;
  totalMarks?: number;
  grade?: string;
  gpa?: number;
  remarks?: string;
  hasMark: boolean;
}

export default function TeacherViewResult() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [exams, setExams] = useState<ExamOption[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loadingExams, setLoadingExams] = useState<boolean>(true);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "info" | "error" | "success"; text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Teacher Assignments
  useEffect(() => {
    async function fetchAssignments() {
      if (!user?.email) return;
      setLoadingAssignments(true);
      try {
        const res = await fetch(`${API_BASE}/api/assignments?teacherEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAssignments(data.data);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoadingAssignments(false);
      }
    }
    fetchAssignments();
  }, [user?.email, API_BASE]);

  // Load Exams from API
  useEffect(() => {
    async function fetchExams() {
      setLoadingExams(true);
      try {
        const res = await fetch(`${API_BASE}/api/exams`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setExams(data.data);
          const firstExam = data.data[0];
          setSelectedExamId(firstExam._id || firstExam.examName);
          setSelectedClass(firstExam.className || "");
          setSelectedStream(firstExam.stream || firstExam.group || "");
          setSelectedSection(firstExam.section ? firstExam.section.toUpperCase().replace("SECTION", "").trim() : "A");
          setSelectedSubject(firstExam.subject || "");
        } else {
          setExams([]);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoadingExams(false);
      }
    }

    fetchExams();
  }, [API_BASE]);

  // Identify current selected Exam object
  const currentExam = useMemo(() => {
    return exams.find((ex) => ex._id === selectedExamId || ex.examName === selectedExamId) || null;
  }, [exams, selectedExamId]);

  // Check if teacher is authorized to EDIT marks for current selection
  const canEditCurrentResult = useMemo(() => {
    if (!currentExam) return false;
    if (currentExam.createdByEmail && user?.email && currentExam.createdByEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }

    const norm = (str?: string) => (str || "").toLowerCase().replace(/[\s_-]/g, "");
    const examClassNorm = norm(currentExam.className);
    const examSubNorm = norm(currentExam.subject);
    const examStreamNorm = norm(currentExam.stream || currentExam.group);
    const examSecNorm = (currentExam.section || "A").toUpperCase().replace("SECTION", "").trim();

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
  }, [currentExam, assignments, user]);

  // Constrain Class, Section, Stream, and Subject when selected Exam changes
  useEffect(() => {
    if (currentExam) {
      setSelectedClass(currentExam.className || "");
      setSelectedStream(currentExam.stream || currentExam.group || "");
      setSelectedSection(
        currentExam.section ? currentExam.section.toUpperCase().replace("SECTION", "").trim() : "A"
      );
      setSelectedSubject(currentExam.subject || "");
    }
  }, [currentExam]);

  // Load Results matching current selection
  useEffect(() => {
    if (!currentExam || !selectedClass || !selectedSection) {
      setResults([]);
      return;
    }

    const examItem = currentExam;

    async function loadResults() {
      setLoadingResults(true);
      setFeedback(null);

      try {
        // 1. Fetch Students matching Class + Section + Stream
        let stuUrl = `${API_BASE}/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`;
        if (selectedStream) {
          stuUrl += `&stream=${encodeURIComponent(selectedStream)}`;
        }

        const stuRes = await fetch(stuUrl);
        const stuData = await stuRes.json();
        const studentList: StudentItem[] = stuData.success && Array.isArray(stuData.data) ? stuData.data : [];

        // 2. Fetch Marks
        let markUrl = `${API_BASE}/api/marks?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&exam=${encodeURIComponent(examItem.examName)}`;
        if (examItem._id) {
          markUrl += `&examId=${encodeURIComponent(examItem._id)}`;
        }
        if (selectedSubject) {
          markUrl += `&subject=${encodeURIComponent(selectedSubject)}`;
        }
        if (selectedStream) {
          markUrl += `&stream=${encodeURIComponent(selectedStream)}`;
        }

        const markRes = await fetch(markUrl);
        const markData = await markRes.json();
        const marksList = markData.success && Array.isArray(markData.data) ? markData.data : [];

        const marksByStudentId: Record<string, any> = {};
        marksList.forEach((m: any) => {
          marksByStudentId[m.studentId] = m;
        });

        // 3. Merge Roster
        const tMarks = examItem.totalMarks || 100;
        const merged: ResultRecord[] = studentList.map((stu) => {
          const sId = stu.studentId || stu._id || "";
          const markEntry = marksByStudentId[sId];

          if (markEntry) {
            return {
              studentId: sId,
              studentName: stu.name,
              roll: stu.roll,
              className: selectedClass,
              stream: selectedStream,
              section: selectedSection,
              exam: examItem.examName,
              subject: selectedSubject || examItem.subject || "All Subjects",
              marksObtained: markEntry.marksObtained,
              totalMarks: markEntry.totalMarks || tMarks,
              grade: markEntry.grade,
              gpa: markEntry.gpa,
              remarks: markEntry.remarks || "",
              hasMark: true
            };
          }

          return {
            studentId: sId,
            studentName: stu.name,
            roll: stu.roll,
            className: selectedClass,
            stream: selectedStream,
            section: selectedSection,
            exam: examItem.examName,
            subject: selectedSubject || examItem.subject || "All Subjects",
            totalMarks: tMarks,
            grade: "-",
            gpa: 0.0,
            hasMark: false
          };
        });

        // Sort by Roll (numeric)
        merged.sort((a, b) => (Number(a.roll) || 0) - (Number(b.roll) || 0));
        setResults(merged);

        const enteredCount = merged.filter((r) => r.hasMark).length;
        if (enteredCount === 0 && studentList.length > 0) {
          setFeedback({
            type: "info",
            text: `No marks have been entered yet for ${examItem.examName}.`
          });
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setFeedback({
          type: "error",
          text: "Failed to load examination results."
        });
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    }

    loadResults();
  }, [currentExam, selectedClass, selectedStream, selectedSection, selectedSubject, API_BASE]);

  // Filtered results by search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return results;
    const q = searchQuery.toLowerCase().trim();
    return results.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.roll.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q)
    );
  }, [results, searchQuery]);

  // Result statistics
  const stats = useMemo(() => {
    const total = results.length;
    const evaluated = results.filter((r) => r.hasMark);
    const passMarks = currentExam?.passMarks || 40;
    const passed = evaluated.filter((r) => (r.marksObtained ?? 0) >= passMarks).length;
    const failed = evaluated.filter((r) => (r.marksObtained ?? 0) < passMarks).length;
    const passRate = evaluated.length > 0 ? Math.round((passed / evaluated.length) * 100) : 0;

    const gpas = evaluated.map((r) => r.gpa || 0);
    const avgGpa = gpas.length > 0 ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : "0.00";

    const marks = evaluated.map((r) => r.marksObtained || 0);
    const highestMark = marks.length > 0 ? Math.max(...marks) : 0;

    return { total, evaluatedCount: evaluated.length, passed, failed, passRate, avgGpa, highestMark };
  }, [results, currentExam]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Award className="h-4 w-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                View Examination Results
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review published marks, class performance analytics, and student grade reports.
            </p>
          </div>

          {canEditCurrentResult ? (
            <button
              type="button"
              onClick={() => router.push(`/teacher/enterMarks?examId=${selectedExamId}`)}
              className="bg-[#03204C] hover:bg-[#1556a7] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 transition cursor-pointer"
            >
              <FileSpreadsheet size={16} /> Enter / Edit Marks
            </button>
          ) : (
            <button
              disabled
              title="You can only edit marks for your assigned class and subject"
              className="bg-slate-200 text-slate-400 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock size={15} /> Marks Edit Restricted
            </button>
          )}
        </div>

        {/* Scope Selection Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Exam Selector */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Select Exam
              </label>
              <div className="relative">
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  disabled={loadingExams}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 cursor-pointer"
                >
                  {loadingExams ? (
                    <option value="">Loading exams...</option>
                  ) : exams.length === 0 ? (
                    <option value="">No exams available</option>
                  ) : (
                    exams.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.examName} ({ex.className}
                        {ex.stream ? ` - ${ex.stream}` : ""}
                        {ex.section ? ` Sec ${ex.section}` : ""})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Target Class & Stream */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Target Class & Stream
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                {selectedClass || "N/A"}{selectedStream ? ` (${selectedStream})` : ""}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Subject
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                {selectedSubject || "All Subjects"}
              </div>
            </div>
          </div>

          {/* Edit Permission Status Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Exam Section: <strong>Section {selectedSection}</strong>
            </span>
            {canEditCurrentResult ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check size={12} /> You have Mark Edit Permission for this course
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Lock size={12} /> Read-Only View (Assigned to another faculty member)
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : feedback.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Analytics Statistics Cards */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Enrolled</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Evaluated</span>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {stats.evaluatedCount} / {stats.total}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Passed</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{stats.passed}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Failed</span>
              <div className="text-xl font-bold text-rose-600 mt-1">{stats.failed}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Average GPA</span>
              <div className="text-xl font-bold text-purple-600 mt-1">{stats.avgGpa}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Highest Mark</span>
              <div className="text-xl font-bold text-amber-600 mt-1">{stats.highestMark}</div>
            </div>
          </div>
        )}

        {/* Results Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-700">{filteredResults.length}</span> students
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Roll</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4 text-center">Marks Obtained</th>
                  <th className="py-3.5 px-4 text-center">Grade</th>
                  <th className="py-3.5 px-4 text-center">GPA</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingResults ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Loading examination results...
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No results found for current selection.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((row, index) => {
                    const passMarks = currentExam?.passMarks || 40;
                    const isPass = row.hasMark && (row.marksObtained ?? 0) >= passMarks;

                    return (
                      <tr key={row.studentId || index} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {row.roll}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                          {row.studentId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {row.studentName}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          {row.hasMark ? (
                            <span className="text-slate-900">
                              {row.marksObtained} <span className="text-xs text-slate-400 font-normal">/ {row.totalMarks || 100}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Not Entered</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              row.grade === "A+" || row.grade === "A"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : row.grade === "A-" || row.grade === "B"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : row.grade === "C" || row.grade === "D"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : row.grade === "F"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            }`}
                          >
                            {row.grade || "-"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {row.hasMark ? (row.gpa ? row.gpa.toFixed(2) : "0.00") : "-"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {row.hasMark ? (
                            isPass ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 size={12} /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle size={12} /> Fail
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 max-w-[200px] truncate">
                          {row.remarks || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

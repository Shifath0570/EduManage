"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  PencilLine,
  CheckCircle2,
  AlertCircle,







  // hdfjsdghjfghjf
  Save,
  Layers,
  ChevronDown,
  Loader2,
  Check,
  Lock
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
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
  createdBy?: string;
  createdByEmail?: string;
  createdByName?: string;
  createdByRole?: string;
}

interface StudentItem {
  _id?: string;
  studentId: string;
  name: string;
  roll: string;
  className: string;
  stream?: string;
  group?: string;
  section: string;
}

interface StudentMarkRow {
  studentId: string;
  studentName: string;
  roll: string;
  marksObtained: number | string;
  totalMarks: number;
  grade: string;
  gpa: number;
  remarks: string;
}

// Helper to calculate Grade & GPA live in UI
const computeGradeAndGpa = (marks: number, total = 100) => {
  const percentage = total > 0 ? (marks / total) * 100 : 0;
  if (percentage >= 80) return { grade: "A+", gpa: 5.0 };
  if (percentage >= 70) return { grade: "A", gpa: 4.0 };
  if (percentage >= 60) return { grade: "A-", gpa: 3.5 };
  if (percentage >= 50) return { grade: "B", gpa: 3.0 };
  if (percentage >= 40) return { grade: "C", gpa: 2.0 };
  if (percentage >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
};

export default function TeacherEnterMarks() {
  const searchParams = useSearchParams();
  const initialExamId = searchParams.get("examId") || "";

  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string; image?: string; role?: string } | undefined;

  const [exams, setExams] = useState<ExamOption[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examTotalMarks, setExamTotalMarks] = useState<number>(100);

  const [studentRows, setStudentRows] = useState<StudentMarkRow[]>([]);
  const [loadingExams, setLoadingExams] = useState<boolean>(true);
  const [loadingRoster, setLoadingRoster] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Check if logged-in teacher is creator / owner of a specific exam
  const isOwner = (examItem: ExamOption | null) => {
    if (!examItem) return false;
    if (user?.role === "admin") return true;

    // 1. Email match
    if (examItem.createdByEmail && user?.email && examItem.createdByEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    // 2. User ID match
    if (examItem.createdBy && user?.id && String(examItem.createdBy) === String(user.id)) {
      return true;
    }
    return false;
  };

  // Partition exams into owned vs other exams
  const myExams = useMemo(() => {
    return exams.filter((e) => isOwner(e));
  }, [exams, user]);

  const otherExams = useMemo(() => {
    return exams.filter((e) => !isOwner(e));
  }, [exams, user]);

  // Load Exams from API on mount
  useEffect(() => {
    async function fetchExams() {
      setLoadingExams(true);
      try {
        const res = await fetch(`${API_BASE}/api/exams`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setExams(data.data);

          // Find target exam (prefer requested initialExamId, or first myExam, or first exam)
          let target = initialExamId
            ? data.data.find((e: ExamOption) => e._id === initialExamId) || null
            : null;

          if (!target) {
            const firstMyExam = data.data.find((e: ExamOption) =>
              e.createdByEmail && user?.email && e.createdByEmail.toLowerCase() === user.email.toLowerCase()
            );
            target = firstMyExam || data.data[0];
          }

          if (target) {
            setSelectedExamId(target._id || target.examName);
            setSelectedClass(target.className || "");
            setSelectedStream(target.stream || target.group || "");
            setSelectedSection(target.section ? target.section.toUpperCase().replace("SECTION", "").trim() : "A");
            setSelectedSubject(target.subject || "");
            setExamTotalMarks(target.totalMarks || 100);
          }
        } else {
          setExams([]);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        setFeedback({
          type: "error",
          text: "Failed to connect to backend server for exam list."
        });
      } finally {
        setLoadingExams(false);
      }
    }

    fetchExams();
  }, [API_BASE, initialExamId, user?.email]);

  // Identify current selected Exam object
  const currentExam = useMemo(() => {
    return exams.find((ex) => ex._id === selectedExamId || ex.examName === selectedExamId) || null;
  }, [exams, selectedExamId]);

  // Is current exam authorized?
  const isAuthorized = useMemo(() => {
    return currentExam ? isOwner(currentExam) : false;
  }, [currentExam, user]);

  // Constrain Class, Stream, Section, and Subject whenever the selected Exam changes
  useEffect(() => {
    if (currentExam) {
      setSelectedClass(currentExam.className || "");
      setSelectedStream(currentExam.stream || currentExam.group || "");
      setSelectedSection(
        currentExam.section ? currentExam.section.toUpperCase().replace("SECTION", "").trim() : "A"
      );
      setSelectedSubject(currentExam.subject || "");
      setExamTotalMarks(currentExam.totalMarks || 100);
    }
  }, [currentExam]);

  // Load student roster matching exam and prefill marks
  useEffect(() => {
    if (!currentExam || !selectedClass || !selectedSection) {
      setStudentRows([]);
      return;
    }

    const examItem = currentExam;

    async function loadStudentRosterAndMarks() {
      setLoadingRoster(true);
      setFeedback(null);
      try {
        // 1. Fetch students strictly for target Class + Section + Stream
        let stuUrl = `${API_BASE}/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`;
        if (selectedStream) {
          stuUrl += `&stream=${encodeURIComponent(selectedStream)}`;
        }

        const stuRes = await fetch(stuUrl);
        const stuData = await stuRes.json();
        const rawStudents: StudentItem[] = stuData.success && Array.isArray(stuData.data) ? stuData.data : [];

        // 2. Fetch existing marks for selected Exam + Class + Section + Subject + Stream
        let markUrl = `${API_BASE}/api/marks?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&exam=${encodeURIComponent(examItem.examName)}&subject=${encodeURIComponent(selectedSubject)}`;
        if (examItem._id) {
          markUrl += `&examId=${encodeURIComponent(examItem._id)}`;
        }
        if (selectedStream) {
          markUrl += `&stream=${encodeURIComponent(selectedStream)}`;
        }

        const markRes = await fetch(markUrl);
        const markData = await markRes.json();
        const existingMarksMap: Record<string, { marksObtained: number; grade: string; gpa: number; remarks?: string }> = {};

        if (markData.success && Array.isArray(markData.data)) {
          markData.data.forEach((m: { studentId: string; marksObtained: number; grade: string; gpa: number; remarks?: string }) => {
            existingMarksMap[m.studentId] = m;
          });
        }

        // 3. Merge student roster with existing marks
        if (rawStudents.length > 0) {
          const tMarks = examItem.totalMarks || 100;
          const rows: StudentMarkRow[] = rawStudents.map((s) => {
            const stuId = s.studentId || s._id || "";
            const existing = existingMarksMap[stuId];
            const marksVal = existing !== undefined ? existing.marksObtained : "";
            const computed = marksVal !== "" ? computeGradeAndGpa(Number(marksVal), tMarks) : { grade: "-", gpa: 0.0 };

            return {
              studentId: stuId,
              studentName: s.name,
              roll: s.roll,
              marksObtained: marksVal,
              totalMarks: tMarks,
              grade: existing?.grade || computed.grade,
              gpa: existing?.gpa !== undefined ? existing.gpa : computed.gpa,
              remarks: existing?.remarks || ""
            };
          });

          setStudentRows(rows);
          if (Object.keys(existingMarksMap).length > 0) {
            setFeedback({
              type: "info",
              text: `Loaded existing marks for ${Object.keys(existingMarksMap).length} students.`
            });
          }
        } else {
          setStudentRows([]);
        }
      } catch (err) {
        console.error("Error fetching students and marks:", err);
        setFeedback({
          type: "error",
          text: "Failed to connect to backend server for student roster."
        });
        setStudentRows([]);
      } finally {
        setLoadingRoster(false);
      }
    }

    loadStudentRosterAndMarks();
  }, [currentExam, selectedClass, selectedStream, selectedSection, selectedSubject, API_BASE]);

  // Handle Mark input change per student
  const handleMarkChange = (studentId: string, value: string) => {
    let numVal: number | string = value;
    if (value !== "") {
      const parsed = Number(value);
      if (isNaN(parsed) || parsed < 0) numVal = 0;
      else if (parsed > examTotalMarks) numVal = examTotalMarks;
      else numVal = parsed;
    }

    setStudentRows((prev) =>
      prev.map((row) => {
        if (row.studentId === studentId) {
          const computed = numVal !== "" ? computeGradeAndGpa(Number(numVal), row.totalMarks) : { grade: "-", gpa: 0.0 };
          return {
            ...row,
            marksObtained: numVal,
            grade: computed.grade,
            gpa: computed.gpa
          };
        }
        return row;
      })
    );
  };

  // Handle Remarks input change per student
  const handleRemarkChange = (studentId: string, remarks: string) => {
    setStudentRows((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, remarks } : row))
    );
  };

  // Quick action: Set all empty marks to 0
  const handleSetDefaultMarks = (val: number) => {
    setStudentRows((prev) =>
      prev.map((row) => {
        if (row.marksObtained === "" || row.marksObtained === undefined) {
          const computed = computeGradeAndGpa(val, row.totalMarks);
          return {
            ...row,
            marksObtained: val,
            grade: computed.grade,
            gpa: computed.gpa
          };
        }
        return row;
      })
    );
  };

  // Submit and save marks to database (with strict backend verification)
  const handleSaveMarks = async () => {
    if (!currentExam) {
      toast.error("Please select an Exam first.");
      return;
    }

    if (!isAuthorized) {
      toast.error("Forbidden: You can only enter marks for your assigned class, section, and subject.");
      return;
    }

    const examItem = currentExam;

    if (studentRows.length === 0) {
      toast.error("No students available to save marks for.");
      return;
    }

    const unentered = studentRows.filter((r) => r.marksObtained === "" || r.marksObtained === undefined);
    if (unentered.length > 0) {
      const confirmSave = confirm(
        `Warning: ${unentered.length} student(s) have empty marks. They will be saved as 0. Do you want to continue?`
      );
      if (!confirmSave) return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        examId: examItem._id,
        exam: examItem.examName,
        className: selectedClass,
        stream: selectedStream || null,
        section: selectedSection,
        subject: selectedSubject,
        teacherEmail: user?.email,
        teacherRole: "teacher",
        records: studentRows.map((r) => ({
          studentId: r.studentId,
          studentName: r.studentName,
          roll: r.roll,
          marksObtained: r.marksObtained === "" ? 0 : Number(r.marksObtained),
          totalMarks: r.totalMarks,
          remarks: r.remarks
        }))
      };

      const res = await fetch(`${API_BASE}/api/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
          "x-user-role": "teacher"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save student marks.");
      }

      const streamBadge = selectedStream ? ` (${selectedStream})` : "";
      const successMsg = `Successfully saved marks for ${data.count} students in ${selectedClass}${streamBadge} Section ${selectedSection} (${selectedSubject})!`;
      toast.success(successMsg);
      setFeedback({
        type: "success",
        text: successMsg
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save marks.";
      toast.error(msg);
      setFeedback({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  // Live Statistics
  const stats = useMemo(() => {
    const total = studentRows.length;
    const entered = studentRows.filter((r) => r.marksObtained !== "" && r.marksObtained !== undefined).length;
    const passed = studentRows.filter((r) => {
      const m = Number(r.marksObtained) || 0;
      return m >= (currentExam?.passMarks || 40);
    }).length;
    const scores = studentRows
      .map((r) => Number(r.marksObtained))
      .filter((m) => !isNaN(m) && m >= 0);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0";
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    return { total, entered, passed, avgScore, highestScore };
  }, [studentRows, currentExam]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <PencilLine className="h-4 w-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Enter Student Marks
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Enter student marks and compute grades in real time for examinations you created.
            </p>
          </div>
        </div>

        {/* Filter Selection Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            Exam & Target Scope Selection
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Exam Selector */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Select Exam <span className="text-red-500">*</span>
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
                    <option value="">No exams scheduled</option>
                  ) : (
                    <>
                      {myExams.length > 0 && (
                        <optgroup label="My Created Exams (Mark Entry Enabled)">
                          {myExams.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              ✓ {ex.examName} ({ex.className}
                              {ex.stream ? ` - ${ex.stream}` : ""}
                              {ex.section ? ` Sec ${ex.section}` : ""}) - {ex.subject}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {otherExams.length > 0 && (
                        <optgroup label="Other Exams (Restricted - View Only)">
                          {otherExams.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              🔒 {ex.examName} ({ex.className}
                              {ex.stream ? ` - ${ex.stream}` : ""}
                              {ex.section ? ` Sec ${ex.section}` : ""}) - {ex.subject}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </>
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Target Class */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Class
              </label>
              <input
                type="text"
                readOnly
                value={selectedClass || "N/A"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none cursor-not-allowed"
              />
            </div>

            {/* Stream / Group */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Stream / Group
              </label>
              <input
                type="text"
                readOnly
                value={selectedStream || "General / None"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none cursor-not-allowed"
              />
            </div>

            {/* Section */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Section
              </label>
              <input
                type="text"
                readOnly
                value={selectedSection ? `Section ${selectedSection}` : "N/A"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Subject & Authorization Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Subject:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                {selectedSubject || "All Subjects"}
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-500">Max Marks:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {examTotalMarks}
              </span>
            </div>

            <div>
              {isAuthorized ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check size={13} /> You Created This Exam • Mark Entry Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Lock size={13} /> Restricted • Created by {currentExam?.createdByName || currentExam?.createdByEmail || "Another Teacher"} (View Only)
                </span>
              )}
            </div>
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
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : feedback.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Live Statistics Cards */}
        {studentRows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Enrolled</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Marks Entered</span>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {stats.entered} / {stats.total}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Average Score</span>
              <div className="text-xl font-bold text-purple-600 mt-1">{stats.avgScore}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Passed Students</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {stats.passed} <span className="text-xs text-slate-400 font-normal">({stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Student Roster Marks Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Student Marks Roster
              </h3>
              <p className="text-xs text-slate-500">
                Enter score out of {examTotalMarks} for each student. Grade and GPA calculate automatically.
              </p>
            </div>

            {/* Quick autofill helper */}
            {isAuthorized && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Fill empty:</span>
                <button
                  type="button"
                  onClick={() => handleSetDefaultMarks(0)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                >
                  Set 0
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Roll</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4 text-center w-36">
                    Marks (Max {examTotalMarks})
                  </th>
                  <th className="py-3.5 px-4 text-center w-20">Grade</th>
                  <th className="py-3.5 px-4 text-center w-20">GPA</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingRoster ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span>Loading student roster for {selectedClass}...</span>
                      </div>
                    </td>
                  </tr>
                ) : studentRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No students found enrolled in {selectedClass}
                      {selectedStream ? ` (${selectedStream})` : ""} Section {selectedSection}.
                    </td>
                  </tr>
                ) : (
                  studentRows.map((row, index) => {
                    const numMarks = Number(row.marksObtained);
                    const isPass = !isNaN(numMarks) && numMarks >= (currentExam?.passMarks || 40);

                    return (
                      <tr key={row.studentId || index} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 text-center font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {row.roll}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {row.studentId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {row.studentName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={examTotalMarks}
                            placeholder="0"
                            value={row.marksObtained}
                            onChange={(e) => handleMarkChange(row.studentId, e.target.value)}
                            disabled={!isAuthorized}
                            className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${
                              row.grade === "A+" || row.grade === "A"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : row.grade === "A-" || row.grade === "B"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : row.grade === "C" || row.grade === "D"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : row.grade === "F"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            {row.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-700">
                          {row.gpa > 0 ? row.gpa.toFixed(2) : "0.00"}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional note..."
                            value={row.remarks}
                            onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                            disabled={!isAuthorized}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Save Button */}
          {studentRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 bg-slate-50/40">
              <span className="text-xs text-slate-500">
                {isAuthorized ? (
                  `${studentRows.length} student record(s) ready to be saved.`
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <Lock size={13} /> You are not authorized to save marks for this examination.
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={handleSaveMarks}
                disabled={saving || !isAuthorized}
                className="flex items-center gap-2 rounded-xl bg-[#03204C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1556a7] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving Marks...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save & Publish Marks
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

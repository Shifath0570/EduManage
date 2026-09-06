"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PencilLine,
  CheckCircle2,
  AlertCircle,
  Save,
  Layers,
  ChevronDown,
  GraduationCap,
  BookOpen
} from "lucide-react";

interface ExamOption {
  _id?: string;
  examName: string;
  className: string;
  stream?: string;
  group?: string;
  section?: string;
  subject?: string;
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

export default function AdminEnterMarks() {
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [studentRows, setStudentRows] = useState<StudentMarkRow[]>([]);
  const [loadingExams, setLoadingExams] = useState<boolean>(true);
  const [loadingRoster, setLoadingRoster] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Identify current selected Exam object
  const currentExam = useMemo(() => {
    return exams.find((ex) => ex._id === selectedExamId || ex.examName === selectedExamId) || null;
  }, [exams, selectedExamId]);

  // Load Exams from API on mount
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
        setFeedback({
          type: "error",
          text: "Failed to connect to backend server for exam list."
        });
      } finally {
        setLoadingExams(false);
      }
    }

    fetchExams();
  }, [API_BASE]);

  // Constrain Class, Stream, Section, and Subject whenever the selected Exam changes
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

  // Load ONLY students strictly matching the target Exam (Class + Group/Stream + Section), and prefill marks
  useEffect(() => {
    if (!currentExam || !selectedClass || !selectedSection || !selectedSubject) {
      setStudentRows([]);
      return;
    }

    const examItem = currentExam;

    async function loadStudentRosterAndMarks() {
      setLoadingRoster(true);
      setFeedback(null);
      try {
        // 1. Fetch students strictly for target Class + Section + Stream (if applicable)
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
          const rows: StudentMarkRow[] = rawStudents.map((s) => {
            const stuId = s.studentId || s._id || "";
            const existing = existingMarksMap[stuId];
            const marksVal = existing !== undefined ? existing.marksObtained : "";
            const computed = marksVal !== "" ? computeGradeAndGpa(Number(marksVal)) : { grade: "-", gpa: 0.0 };

            return {
              studentId: stuId,
              studentName: s.name,
              roll: s.roll,
              marksObtained: marksVal,
              totalMarks: 100,
              grade: existing?.grade || computed.grade,
              gpa: existing?.gpa !== undefined ? existing.gpa : computed.gpa,
              remarks: existing?.remarks || ""
            };
          });

          setStudentRows(rows);
          if (Object.keys(existingMarksMap).length > 0) {
            setFeedback({
              type: "success",
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
      else if (parsed > 100) numVal = 100;
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

  // Submit and save marks to database
  const handleSaveMarks = async () => {
    if (!currentExam) {
      alert("Please select an Exam first.");
      return;
    }

    const examItem = currentExam;

    if (studentRows.length === 0) {
      alert("No students available to save marks for.");
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save student marks.");
      }

      const streamBadge = selectedStream ? ` (${selectedStream})` : "";
      setFeedback({
        type: "success",
        text: `Successfully saved marks for ${data.count} students in ${selectedClass}${streamBadge} Section ${selectedSection} (${selectedSubject})!`
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save marks.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <PencilLine className="h-4 w-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Enter Student Marks
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Select an examination to enter marks. Target Class, Group/Stream, Section, and Subject are automatically determined by the Exam.
            </p>
          </div>
        </div>

        {/* Filter Selection Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#6348eb]" />
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
                  disabled={loadingExams || exams.length === 0}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                >
                  {exams.length === 0 ? (
                    <option value="">No examinations available</option>
                  ) : (
                    exams.map((ex) => (
                      <option key={ex._id || ex.examName} value={ex._id || ex.examName}>
                        {ex.examName} ({ex.className}
                        {ex.stream ? ` - ${ex.stream}` : ""} - Sec {ex.section || "A"}
                        {ex.subject ? ` - ${ex.subject}` : ""})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Target Class (Auto-derived) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Class
                </label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Locked
                </span>
              </div>
              <input
                type="text"
                disabled
                readOnly
                value={selectedClass || "Auto-set by Exam"}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed select-none"
              />
            </div>

            {/* Target Group / Stream (Auto-derived for Class 9 & 10) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Group / Stream
                </label>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                  Locked
                </span>
              </div>
              <input
                type="text"
                disabled
                readOnly
                value={selectedStream || (selectedClass === "Class 9" || selectedClass === "Class 10" ? "Not set" : "N/A (Class 1-8)")}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed select-none"
              />
            </div>

            {/* Target Section (Auto-derived) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Section
                </label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Locked
                </span>
              </div>
              <input
                type="text"
                disabled
                readOnly
                value={selectedSection ? `Section ${selectedSection}` : "Auto-set by Exam"}
                className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Subject Display */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Target Subject:</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {selectedSubject || "All Subjects"}
              </span>
            </div>
            {selectedStream && (
              <span className="font-medium text-slate-500">
                Eligible Group: <strong className="text-slate-800">{selectedStream}</strong>
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
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Mark Entry Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {/* Table Banner */}
          <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/40">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Marks • {selectedClass || "Select Class"}
                {selectedStream ? ` (${selectedStream})` : ""} (Section {selectedSection})
              </h3>
              <p className="text-xs text-slate-500">
                Exam: <span className="font-semibold text-slate-700">{currentExam?.examName || "None"}</span> | Subject: <span className="font-semibold text-slate-700">{selectedSubject || "None"}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                {studentRows.length} Eligible Students
              </span>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Roll</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4 text-center w-36">Marks (out of 100)</th>
                  <th className="py-3.5 px-4 text-center">Grade / GPA</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingRoster ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading eligible students for {selectedClass}{selectedStream ? ` (${selectedStream})` : ""} Section {selectedSection}...
                    </td>
                  </tr>
                ) : studentRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No eligible students found matching <span className="font-semibold text-slate-600">{selectedClass}{selectedStream ? ` (${selectedStream})` : ""} Section {selectedSection}</span>.
                    </td>
                  </tr>
                ) : (
                  studentRows.map((row, idx) => (
                    <tr key={row.studentId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {row.roll}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {row.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        {row.studentId}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="0 - 100"
                          value={row.marksObtained}
                          onChange={(e) => handleMarkChange(row.studentId, e.target.value)}
                          className="w-24 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-center text-sm font-bold text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.grade !== "-" ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              row.grade === "A+" || row.grade === "A"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : row.grade === "A-" || row.grade === "B"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : row.grade === "C" || row.grade === "D"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {row.grade} ({row.gpa.toFixed(1)})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="Optional remark"
                          value={row.remarks}
                          onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                          className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Submit Button */}
          <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/40">
            <div className="text-xs text-slate-500">
              Exam: <span className="font-semibold text-slate-700">{currentExam?.examName || "None"}</span> | Target:{" "}
              <span className="font-semibold text-slate-700">
                {selectedClass}{selectedStream ? ` (${selectedStream})` : ""} - Section {selectedSection}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveMarks}
              disabled={saving || studentRows.length === 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#03204c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#03204c]/20 hover:bg-[#02183a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Marks..." : "Save Marks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

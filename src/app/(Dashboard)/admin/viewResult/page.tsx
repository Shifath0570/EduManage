"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  AlertCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

interface ExamOption {
  _id?: string;
  examName: string;
  className: string;
  section?: string;
  subject?: string;
}

interface StudentItem {
  studentId: string;
  name: string;
  roll: string;
  className: string;
  section: string;
}

interface ResultRecord {
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  section: string;
  exam: string;
  subject: string;
  marksObtained?: number;
  totalMarks?: number;
  grade?: string;
  gpa?: number;
  hasMark: boolean;
}

const classOptions = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
];

const sectionOptions = ["A", "B", "C", "D"];

const subjectOptions = [
  "All Subjects", "Mathematics", "English", "Bangla", "Science",
  "Physics", "Chemistry", "Biology", "ICT",
  "Social Science", "Accounting", "General"
];

export default function AdminViewResult() {
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");

  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loadingExams, setLoadingExams] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "info" | "error"; text: string } | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Identify selected Exam object
  const currentExam = React.useMemo(() => {
    return exams.find((ex) => ex.examName === selectedExam || ex._id === selectedExam) || null;
  }, [exams, selectedExam]);

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
          setSelectedExam(firstExam.examName);
          if (firstExam.className) {
            setSelectedClass(firstExam.className);
          }
          setSelectedSection(firstExam.section ? firstExam.section.toUpperCase().replace('SECTION', '').trim() : "A");
          if (firstExam.subject && firstExam.subject !== "All Subjects") {
            setSelectedSubject(firstExam.subject);
          } else {
            setSelectedSubject("All Subjects");
          }
        } else {
          // Fallback exam list if database is freshly initialized
          const defaults: ExamOption[] = [
            { examName: "Mid Term Examination 2026", className: "Class 10", section: "A", subject: "Mathematics" },
            { examName: "Final Examination 2026", className: "Class 10", section: "A", subject: "All Subjects" },
            { examName: "Class Test 1", className: "Class 5", section: "B", subject: "English" }
          ];
          setExams(defaults);
          setSelectedExam(defaults[0].examName);
          setSelectedClass(defaults[0].className);
          setSelectedSection(defaults[0].section || "A");
          setSelectedSubject(defaults[0].subject || "All Subjects");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        const defaults: ExamOption[] = [
          { examName: "Mid Term Examination 2026", className: "Class 10", section: "A", subject: "Mathematics" },
          { examName: "Final Examination 2026", className: "Class 10", section: "A", subject: "All Subjects" }
        ];
        setExams(defaults);
        setSelectedExam(defaults[0].examName);
        setSelectedClass(defaults[0].className);
        setSelectedSection(defaults[0].section || "A");
        setSelectedSubject(defaults[0].subject || "All Subjects");
      } finally {
        setLoadingExams(false);
      }
    }

    fetchExams();
  }, [API_BASE]);

  // Constrain Class, Section, and Subject when selected Exam changes
  useEffect(() => {
    if (currentExam) {
      if (currentExam.className) {
        setSelectedClass(currentExam.className);
      }
      setSelectedSection(currentExam.section ? currentExam.section.toUpperCase().replace('SECTION', '').trim() : "A");

      if (currentExam.subject && currentExam.subject !== "All Subjects") {
        setSelectedSubject(currentExam.subject);
      }
    }
  }, [currentExam]);

  // Load Results matching Class + Section + Exam + Subject
  const handleFetchResults = async () => {
    if (!selectedClass || !selectedSection || !selectedExam) {
      return;
    }

    setLoadingResults(true);
    setFeedback(null);

    try {
      // 1. Fetch Students matching Exam Target Class + Section
      const stuRes = await fetch(
        `${API_BASE}/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`
      );
      const stuData = await stuRes.json();
      const studentList: StudentItem[] = stuData.success && Array.isArray(stuData.data) ? stuData.data : [];

      // 2. Fetch Marks for Class + Section + Exam + Subject
      let markUrl = `${API_BASE}/api/marks?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&exam=${encodeURIComponent(selectedExam)}`;
      if (currentExam?._id) {
        markUrl += `&examId=${encodeURIComponent(currentExam._id)}`;
      }
      if (selectedSubject && selectedSubject !== "All Subjects") {
        markUrl += `&subject=${encodeURIComponent(selectedSubject)}`;
      }

      const markRes = await fetch(markUrl);
      const markData = await markRes.json();
      const rawMarks: any[] = markData.success && Array.isArray(markData.data) ? markData.data : [];

      // Map marks by studentId
      const marksMap: Record<string, any> = {};
      rawMarks.forEach((m) => {
        marksMap[m.studentId] = m;
      });

      // 3. Build Result List combining student roster and marks
      if (studentList.length > 0) {
        const combinedResults: ResultRecord[] = studentList.map((stu) => {
          const stuId = stu.studentId || (stu as unknown as { _id: string })._id;
          const markObj = marksMap[stuId];

          if (markObj) {
            return {
              studentId: stuId,
              studentName: stu.name,
              roll: stu.roll,
              className: selectedClass,
              section: selectedSection,
              exam: selectedExam,
              subject: markObj.subject || selectedSubject,
              marksObtained: markObj.marksObtained,
              totalMarks: markObj.totalMarks || 100,
              grade: markObj.grade,
              gpa: markObj.gpa,
              hasMark: true
            };
          }

          return {
            studentId: stuId,
            studentName: stu.name,
            roll: stu.roll,
            className: selectedClass,
            section: selectedSection,
            exam: selectedExam,
            subject: selectedSubject === "All Subjects" ? "General" : selectedSubject,
            hasMark: false
          };
        });

        setResults(combinedResults);
        if (rawMarks.length === 0) {
          setFeedback({
            type: "info",
            text: `Enrolled students found for ${selectedClass} Section ${selectedSection}, but no marks have been entered yet for ${selectedExam} (${selectedSubject}).`
          });
        }
      } else if (rawMarks.length > 0) {
        // Fallback: If student collection search returned empty but marks exist directly
        const markOnlyResults: ResultRecord[] = rawMarks.map((m) => ({
          studentId: m.studentId,
          studentName: m.studentName || "Student",
          roll: m.roll || "0",
          className: selectedClass,
          section: selectedSection,
          exam: selectedExam,
          subject: m.subject || selectedSubject,
          marksObtained: m.marksObtained,
          totalMarks: m.totalMarks || 100,
          grade: m.grade,
          gpa: m.gpa,
          hasMark: true
        }));
        setResults(markOnlyResults);
      } else {
        setResults([]);
        setFeedback({
          type: "info",
          text: `No students or marks found for ${selectedClass} Section ${selectedSection}.`
        });
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setFeedback({
        type: "error",
        text: "Failed to connect to backend server for results."
      });
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  // Auto-fetch results when exam or subject changes
  useEffect(() => {
    if (selectedClass && selectedSection && selectedExam) {
      handleFetchResults();
    }
  }, [selectedClass, selectedSection, selectedExam, selectedSubject]);

  // Statistics calculation
  const totalEnrolled = results.length;
  const markedResults = results.filter((r) => r.hasMark);
  const totalMarked = markedResults.length;
  const passedCount = markedResults.filter((r) => r.grade !== "F").length;
  const highestMark = markedResults.reduce((max, r) => Math.max(max, r.marksObtained || 0), 0);
  const passPercentage = totalMarked > 0 ? Math.round((passedCount / totalMarked) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Eye className="h-4 w-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                View Exam Results
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Query and view student results. Target Class and Section are automatically locked to the selected Exam.
            </p>
          </div>
        </div>

        {/* Filter Configuration Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#03204c]" />
            Result Filter Query
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Exam Selector */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Select Exam <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                >
                  {exams.map((ex, idx) => (
                    <option key={idx} value={ex.examName}>
                      {ex.examName} ({ex.className} - Sec {ex.section || 'A'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Target Class (Constrained by selected Exam) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Class <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  Exam Target
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

            {/* Target Section (Constrained by selected Exam) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Target Section <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  Exam Target
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

            {/* Subject Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                {currentExam?.subject && currentExam.subject !== "All Subjects" && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    Exam Scope
                  </span>
                )}
              </div>
              {currentExam?.subject && currentExam.subject !== "All Subjects" ? (
                <input
                  type="text"
                  disabled
                  readOnly
                  value={selectedSubject}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed select-none"
                />
              ) : (
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    {subjectOptions.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info / Alert Banner */}
        {feedback && (
          <div className="flex items-center gap-3 rounded-xl p-4 text-sm font-medium border bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Live Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalEnrolled}</span>
              <span className="text-xs text-slate-400">Students</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
            <span className="text-xs font-semibold text-blue-700">Marks Evaluated</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-700">{totalMarked}</span>
              <span className="text-xs text-blue-500">/ {totalEnrolled}</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700">Pass Rate</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700">{passPercentage}%</span>
              <span className="text-xs text-emerald-600">({passedCount} passed)</span>
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-xs">
            <span className="text-xs font-semibold text-purple-700">Highest Score</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-700">{totalMarked > 0 ? highestMark : "-"}</span>
              <span className="text-xs text-purple-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/40">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Examination Results Sheet • {selectedClass} ({selectedSection})
              </h3>
              <p className="text-xs text-slate-500">
                Exam: <span className="font-semibold text-slate-700">{selectedExam}</span> | Subject: <span className="font-semibold text-slate-700">{selectedSubject}</span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Roll</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Marks Obtained</th>
                  <th className="py-3.5 px-4 text-center">Grade</th>
                  <th className="py-3.5 px-4 text-center">GPA</th>
                  <th className="py-3.5 px-4 text-center">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingResults ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Loading examination results...
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No results found for <span className="font-semibold text-slate-700">{selectedClass} Section {selectedSection}</span>.
                    </td>
                  </tr>
                ) : (
                  results.map((row, idx) => (
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
                      <td className="py-3.5 px-4 text-slate-600">
                        {row.subject}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {row.hasMark ? `${row.marksObtained} / ${row.totalMarks}` : <span className="text-slate-400 font-normal">Not Entered</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {row.hasMark ? (
                          <span
                            className={`inline-block min-w-[36px] text-center px-2 py-0.5 rounded-md text-xs ${
                              row.grade === "A+" || row.grade === "A"
                                ? "bg-emerald-100 text-emerald-800"
                                : row.grade === "A-" || row.grade === "B"
                                ? "bg-blue-100 text-blue-800"
                                : row.grade === "C" || row.grade === "D"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {row.grade}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        {row.hasMark ? row.gpa?.toFixed(2) : "-"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.hasMark ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              row.grade !== "F"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {row.grade !== "F" ? "PASSED" : "FAILED"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            NOT ENTERED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
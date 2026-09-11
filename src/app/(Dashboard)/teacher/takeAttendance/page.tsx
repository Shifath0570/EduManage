"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Users,
    BookOpen,
    Save,
    Sparkles,
    CheckCheck,
    Layers,
    RotateCcw,
    HelpCircle
} from "lucide-react";

interface StudentRecord {
    studentId: string;
    studentName: string;
    studentEmail?: string;
    roll: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
}

interface AssignmentItem {
    _id: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    groupId?: string;
    academicYear?: string;
    status?: string;
}

const normalizeClassNumber = (className: string) => {
    if (!className) return "";
    const match = String(className).match(/\d+/);
    return match ? match[0] : "";
};

const normalizeSectionName = (sec: string) => {
    if (!sec) return "A";
    return String(sec).toUpperCase().replace(/^SECTION/i, "").replace(/^SEC[-_]/i, "").trim();
};

export default function TeacherTakeAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("A");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

    const API_BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
            ? "https://edu-manage-server-blush.vercel.app"
            : "http://localhost:5000");

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

                    const first = data.data[0];
                    const firstClass = normalizeClassNumber(first.classId) || "1";
                    const firstSec = normalizeSectionName(first.sectionId) || "A";
                    const firstSub = first.subjectId || "";

                    setSelectedClass(firstClass);
                    setSelectedSection(firstSec);
                    setSelectedSubject(firstSub);
                } else {
                    setAssignments([]);
                }
            } catch (err) {
                console.error("Failed to load teacher assignments:", err);
                setAssignments([]);
            } finally {
                setLoadingAssignments(false);
            }
        }

        fetchTeacherAssignments();
    }, [user?.email, API_BASE]);

    // Unique assigned classes for this teacher
    const assignedClassOptions = useMemo(() => {
        const classMap = new Map<string, string>();
        assignments.forEach((a) => {
            const classNum = normalizeClassNumber(a.classId);
            if (classNum) {
                classMap.set(classNum, `Class ${classNum}`);
            }
        });
        return Array.from(classMap.entries())
            .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
            .map(([value, label]) => ({ value, label }));
    }, [assignments]);

    // Assigned sections for selected class
    const assignedSectionOptions = useMemo(() => {
        const sectionSet = new Set<string>();
        assignments
            .filter((a) => normalizeClassNumber(a.classId) === selectedClass)
            .forEach((a) => {
                const sec = normalizeSectionName(a.sectionId);
                if (sec && sec !== "ALL") {
                    sectionSet.add(sec);
                } else if (sec === "ALL") {
                    ["A", "B", "C", "D"].forEach((s) => sectionSet.add(s));
                }
            });
        const list = Array.from(sectionSet).sort();
        return list.length > 0 ? list : ["A"];
    }, [assignments, selectedClass]);

    // Assigned subjects for selected class (and section)
    const assignedSubjectOptions = useMemo(() => {
        const subjectSet = new Set<string>();
        assignments
            .filter((a) => normalizeClassNumber(a.classId) === selectedClass)
            .forEach((a) => {
                if (a.subjectId && a.subjectId !== "All") {
                    subjectSet.add(a.subjectId);
                }
            });
        return Array.from(subjectSet);
    }, [assignments, selectedClass]);

    // Handle class change with auto-selection of valid section and subject
    const handleClassChange = (newClass: string) => {
        setSelectedClass(newClass);
        const matching = assignments.filter((a) => normalizeClassNumber(a.classId) === newClass);
        if (matching.length > 0) {
            const firstSec = normalizeSectionName(matching[0].sectionId) || "A";
            const firstSub = matching[0].subjectId || "";
            setSelectedSection(firstSec);
            setSelectedSubject(firstSub);
        }
    };

    // Handle section change
    const handleSectionChange = (newSection: string) => {
        setSelectedSection(newSection);
        const matching = assignments.filter(
            (a) =>
                normalizeClassNumber(a.classId) === selectedClass &&
                (normalizeSectionName(a.sectionId) === newSection || a.sectionId === "All")
        );
        if (matching.length > 0 && !matching.some((m) => m.subjectId === selectedSubject)) {
            setSelectedSubject(matching[0].subjectId);
        }
    };

    // Load student roster dynamically from MongoDB backend
    const loadRoster = useCallback(async () => {
        if (!selectedClass || !selectedSection || !selectedSubject || !selectedDate) return;

        setLoadingStudents(true);
        setMessage(null);
        try {
            // First check if an attendance session already exists for this date, class, section, subject
            const attRes = await fetch(
                `${API_BASE}/api/attendance?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&subject=${encodeURIComponent(selectedSubject)}&date=${encodeURIComponent(selectedDate)}&userRole=teacher&teacherEmail=${encodeURIComponent(user?.email || "")}`
            );
            const attData = await attRes.json();

            if (attData.success && Array.isArray(attData.data) && attData.data.length > 0) {
                const sessionData = attData.data[0];
                if (sessionData.records && sessionData.records.length > 0) {
                    setStudents(sessionData.records);
                    setMessage({
                        type: "info",
                        text: `Loaded existing saved attendance session (${sessionData.records.length} students). You can update and re-save.`
                    });
                    setLoadingStudents(false);
                    return;
                }
            }

            // Otherwise, fetch enrolled students dynamically from DB for this class and section
            const stuRes = await fetch(
                `${API_BASE}/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&status=Active`
            );
            const stuData = await stuRes.json();

            if (stuData.success && Array.isArray(stuData.data) && stuData.data.length > 0) {
                // Sort by numeric roll if possible
                const sorted = [...stuData.data].sort((a, b) => {
                    const rA = parseInt(a.roll, 10);
                    const rB = parseInt(b.roll, 10);
                    if (!isNaN(rA) && !isNaN(rB)) return rA - rB;
                    return String(a.roll).localeCompare(String(b.roll));
                });

                const formatted: StudentRecord[] = sorted.map((s) => ({
                    studentId: s.studentId || s._id || `STU-${s.roll}`,
                    studentName: s.name,
                    studentEmail: s.email || "",
                    roll: String(s.roll),
                    status: "PRESENT",
                    remarks: ""
                }));
                setStudents(formatted);
            } else {
                setStudents([]);
                setMessage({
                    type: "info",
                    text: `No enrolled active students found in the database for Class ${selectedClass} - Section ${selectedSection}.`
                });
            }
        } catch (err) {
            console.error("Error loading student roster:", err);
            setStudents([]);
            setMessage({
                type: "error",
                text: "Failed to connect to the backend server to fetch student records."
            });
        } finally {
            setLoadingStudents(false);
        }
    }, [selectedClass, selectedSection, selectedSubject, selectedDate, user?.email, API_BASE]);

    useEffect(() => {
        loadRoster();
    }, [loadRoster]);

    // Status change for individual student
    const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
        setStudents((prev) =>
            prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
        );
    };

    // Bulk status updates
    const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
        setStudents((prev) => prev.map((s) => ({ ...s, status })));
    };

    // Save Attendance to Backend
    const handleSaveAttendance = async () => {
        if (students.length === 0) {
            setMessage({
                type: "error",
                text: "Cannot save empty attendance roster. No students enrolled in this section."
            });
            return;
        }

        if (!selectedClass || !selectedSubject) {
            setMessage({
                type: "error",
                text: "Please select an assigned class and subject."
            });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const payload = {
                className: selectedClass,
                section: selectedSection,
                subject: selectedSubject,
                date: selectedDate,
                teacherEmail: user?.email || "",
                teacherName: user?.name || "Teacher",
                teacherRole: "teacher",
                records: students
            };

            const res = await fetch(`${API_BASE}/api/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "teacher",
                    "x-user-email": user?.email || ""
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setMessage({
                    type: "success",
                    text: `Attendance saved successfully for Class ${selectedClass}-${selectedSection} (${selectedSubject}) on ${selectedDate}!`
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Failed to save attendance."
                });
            }
        } catch (err) {
            console.error("Save attendance error:", err);
            setMessage({
                type: "error",
                text: "Failed to connect to the backend server."
            });
        } finally {
            setSaving(false);
        }
    };

    // Live Metrics
    const presentCount = students.filter((s) => s.status === "PRESENT").length;
    const absentCount = students.filter((s) => s.status === "ABSENT").length;
    const lateCount = students.filter((s) => s.status === "LATE").length;
    const excusedCount = students.filter((s) => s.status === "EXCUSED").length;
    const attendancePercentage =
        students.length > 0
            ? Math.round(((presentCount + lateCount) / students.length) * 100)
            : 0;

    return (
        <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md shadow-[#03204c]/20">
                                <BookOpen className="h-5 w-5" />
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                Take Attendance
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Mark daily student attendance for your assigned classes and subjects.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-2 text-xs font-semibold text-blue-800">
                        <Users className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>Teacher Portal • Assigned Classes Only</span>
                    </div>
                </div>

                {/* No Assignment Warning */}
                {!loadingAssignments && assignments.length === 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-6 text-center shadow-xs">
                        <AlertCircle className="mx-auto h-10 w-10 text-amber-600 mb-3" />
                        <h3 className="text-base font-bold text-amber-900">No Class or Subject Assigned</h3>
                        <p className="mt-1 text-sm text-amber-700 max-w-lg mx-auto">
                            You are not currently assigned to any class or subject. You can only record attendance for classes and subjects officially assigned to you by the administration.
                        </p>
                    </div>
                )}

                {/* Selection Configuration Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#03204c]" />
                            Assigned Class & Session Selection
                        </h2>
                        <button
                            type="button"
                            onClick={loadRoster}
                            disabled={!selectedClass || assignedClassOptions.length === 0}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#03204c] transition disabled:opacity-40"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Reload Roster
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Assigned Classes */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Assigned Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => handleClassChange(e.target.value)}
                                disabled={loadingAssignments || assignedClassOptions.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#03204c] focus:bg-white focus:ring-2 focus:ring-[#03204c]/20 disabled:opacity-50"
                            >
                                {loadingAssignments ? (
                                    <option value="">Loading assignments...</option>
                                ) : assignedClassOptions.length === 0 ? (
                                    <option value="">No Assigned Classes</option>
                                ) : (
                                    assignedClassOptions.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Assigned Section */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Assigned Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => handleSectionChange(e.target.value)}
                                disabled={loadingAssignments || assignedSectionOptions.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#03204c] focus:bg-white focus:ring-2 focus:ring-[#03204c]/20 disabled:opacity-50"
                            >
                                {assignedSectionOptions.map((sec) => (
                                    <option key={sec} value={sec}>
                                        Section {sec}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Subject */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Assigned Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={loadingAssignments || assignedSubjectOptions.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#03204c] focus:bg-white focus:ring-2 focus:ring-[#03204c]/20 disabled:opacity-50"
                            >
                                {assignedSubjectOptions.length === 0 ? (
                                    <option value="">No Assigned Subjects</option>
                                ) : (
                                    assignedSubjectOptions.map((sub, idx) => (
                                        <option key={idx} value={sub}>
                                            {sub}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Attendance Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#03204c] focus:bg-white focus:ring-2 focus:ring-[#03204c]/20"
                                />
                                <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications & Feedback */}
                {message && (
                    <div
                        className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
                            message.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : message.type === "info"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        ) : message.type === "info" ? (
                            <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                        <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">{students.length}</span>
                            <span className="text-xs text-slate-400">Students</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Present
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-emerald-700">{presentCount}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Absent
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-rose-700">{absentCount}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Late
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-amber-700">{lateCount}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Attendance Rate
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-indigo-700">{attendancePercentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Student Roster Table Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                    {/* Header Controls */}
                    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Student Roster • Class {selectedClass}-{selectedSection}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Subject: <span className="font-semibold text-slate-700">{selectedSubject}</span> | Date: <span className="font-semibold text-slate-700">{selectedDate}</span>
                            </p>
                        </div>

                        {students.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleMarkAll("PRESENT")}
                                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" /> Mark All Present
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMarkAll("ABSENT")}
                                    className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                                >
                                    <XCircle className="h-3.5 w-3.5" /> Mark All Absent
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4">Roll</th>
                                    <th className="py-3.5 px-4">Student Name</th>
                                    <th className="py-3.5 px-4 text-center">Attendance Status</th>
                                    <th className="py-3.5 px-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingStudents ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            Loading real student roster from database...
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            No students found in the database for Class {selectedClass} - Section {selectedSection}.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, idx) => (
                                        <tr key={student.studentId} className="hover:bg-slate-50/60 transition">
                                            <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-700">
                                                {student.roll}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-900">{student.studentName}</div>
                                                {student.studentEmail && (
                                                    <div className="text-xs text-slate-400">{student.studentEmail}</div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((st) => {
                                                        const isSelected = student.status === st;
                                                        const colorMap = {
                                                            PRESENT: isSelected
                                                                ? "bg-emerald-600 text-white shadow-xs"
                                                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
                                                            ABSENT: isSelected
                                                                ? "bg-rose-600 text-white shadow-xs"
                                                                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700",
                                                            LATE: isSelected
                                                                ? "bg-amber-500 text-white shadow-xs"
                                                                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700",
                                                            EXCUSED: isSelected
                                                                ? "bg-purple-600 text-white shadow-xs"
                                                                : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                                                        };

                                                        return (
                                                            <button
                                                                key={st}
                                                                type="button"
                                                                onClick={() => handleStatusChange(student.studentId, st)}
                                                                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${colorMap[st]}`}
                                                            >
                                                                {st}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <input
                                                    type="text"
                                                    placeholder="Optional note"
                                                    value={student.remarks || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setStudents((prev) =>
                                                            prev.map((s) =>
                                                                s.studentId === student.studentId ? { ...s, remarks: val } : s
                                                            )
                                                        );
                                                    }}
                                                    className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-[#03204c] focus:bg-white"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Submit */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/40">
                        <div className="text-xs text-slate-500">
                            Recording as: <span className="font-semibold text-slate-800">{user?.name || "Teacher"}</span> ({user?.email || "teacher@edumanage.com"})
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveAttendance}
                            disabled={saving || students.length === 0}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#03204c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#03204c]/20 hover:bg-[#02183a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? "Saving to Database..." : "Save Attendance"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
    Calendar,
    Search,
    Filter,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    Layers,
    Eye,
    BookOpen,
    Users,
    Sparkles,
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

interface AttendanceRecordItem {
    studentId: string;
    studentName: string;
    studentEmail?: string;
    roll: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
}

interface AttendanceSession {
    _id: string;
    className: string;
    section: string;
    subject: string;
    date: string;
    teacherEmail: string;
    teacherName: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    records: AttendanceRecordItem[];
    createdAt?: string;
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

interface AIAttendanceNoticeResult {
    _id?: string;
    studentName: string;
    roll?: string;
    className: string;
    section: string;
    subject: string;
    date: string;
    attendancePercentage: number;
    threshold: number;
    isEligibleForExam: boolean;
    title: string;
    message: string;
    teacherName: string;
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

export default function TeacherViewAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterClass, setFilterClass] = useState<string>("All");
    const [filterSection, setFilterSection] = useState<string>("All");
    const [filterSubject, setFilterSubject] = useState<string>("All");
    const [filterSearch, setFilterSearch] = useState<string>("");
    const [filterDate, setFilterDate] = useState<string>("");
    const [filterMonth, setFilterMonth] = useState<string>("");
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);

    const [generatingStudentId, setGeneratingStudentId] = useState<string | null>(null);
    const [aiResultNotice, setAiResultNotice] = useState<AIAttendanceNoticeResult | null>(null);

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

                if (data.success && Array.isArray(data.data)) {
                    setAssignments(data.data);
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

    // Unique assigned classes for dropdown filter
    const assignedClassOptions = useMemo(() => {
        const classMap = new Map<string, string>();
        assignments.forEach((a) => {
            const classNum = normalizeClassNumber(a.classId);
            if (classNum) {
                classMap.set(classNum, `Class ${classNum}`);
            }
        });
        const list = Array.from(classMap.entries())
            .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
            .map(([value, label]) => ({ value, label }));
        return [{ value: "All", label: "All Assigned Classes" }, ...list];
    }, [assignments]);

    // Assigned sections for dropdown filter
    const assignedSectionOptions = useMemo(() => {
        const sectionSet = new Set<string>();
        const relevantAssignments =
            filterClass === "All"
                ? assignments
                : assignments.filter((a) => normalizeClassNumber(a.classId) === filterClass);

        relevantAssignments.forEach((a) => {
            const sec = normalizeSectionName(a.sectionId);
            if (sec && sec !== "ALL") {
                sectionSet.add(sec);
            } else if (sec === "ALL") {
                ["A", "B", "C", "D"].forEach((s) => sectionSet.add(s));
            }
        });
        const list = Array.from(sectionSet).sort();
        return ["All", ...list];
    }, [assignments, filterClass]);

    // Assigned subjects for dropdown filter
    const assignedSubjectOptions = useMemo(() => {
        const subjectSet = new Set<string>();
        const relevantAssignments =
            filterClass === "All"
                ? assignments
                : assignments.filter((a) => normalizeClassNumber(a.classId) === filterClass);

        relevantAssignments.forEach((a) => {
            if (a.subjectId && a.subjectId !== "All") {
                subjectSet.add(a.subjectId);
            }
        });
        const list = Array.from(subjectSet);
        return ["All", ...list];
    }, [assignments, filterClass]);

    const fetchAttendanceData = useCallback(async () => {
        if (!user?.email && loadingAssignments) return;

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("userRole", "teacher");
            if (user?.email) params.append("teacherEmail", user.email);
            if (filterClass !== "All") params.append("className", filterClass);
            if (filterSection !== "All") params.append("section", filterSection);
            if (filterSubject !== "All") params.append("subject", filterSubject);
            if (filterSearch.trim()) params.append("search", filterSearch.trim());
            if (filterDate) params.append("date", filterDate);
            if (filterMonth) params.append("month", filterMonth);

            const res = await fetch(`${API_BASE}/api/attendance?${params.toString()}`, {
                headers: {
                    "x-user-role": "teacher",
                    "x-user-email": user?.email || ""
                }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setSessions(data.data);
            } else {
                setSessions([]);
            }
        } catch (err) {
            console.error("Error fetching attendance records:", err);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, [filterClass, filterSection, filterSubject, filterSearch, filterDate, filterMonth, user?.email, loadingAssignments, API_BASE]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const handleReset = () => {
        setFilterClass("All");
        setFilterSection("All");
        setFilterSubject("All");
        setFilterSearch("");
        setFilterDate("");
        setFilterMonth("");
    };

    const handleSendAiWarning = async (record: AttendanceRecordItem) => {
        if (!selectedSession) return;
        setGeneratingStudentId(record.studentId);
        try {
            const payload = {
                studentId: record.studentId,
                studentName: record.studentName,
                studentEmail: record.studentEmail || "",
                roll: record.roll,
                className: selectedSession.className,
                section: selectedSession.section,
                subject: selectedSession.subject,
                date: selectedSession.date,
                teacherName: user?.name || selectedSession.teacherName || "Teacher",
                teacherEmail: user?.email || selectedSession.teacherEmail || ""
            };

            const res = await fetch(`${API_BASE}/api/attendance/ai-warning`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": "teacher",
                    "x-user-email": user?.email || ""
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success && data.data) {
                setAiResultNotice(data.data);
            } else {
                alert(data.message || "Failed to generate AI attendance notice.");
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Failed to connect to backend server.";
            console.error("AI Warning Error:", err);
            alert(errorMsg);
        } finally {
            setGeneratingStudentId(null);
        }
    };

    // Calculate aggregated metrics
    const totalSessionsRecorded = sessions.length;
    const totalPresentSum = sessions.reduce((acc, s) => acc + (s.presentCount || 0), 0);
    const totalAbsentSum = sessions.reduce((acc, s) => acc + (s.absentCount || 0), 0);
    const totalLateSum = sessions.reduce((acc, s) => acc + (s.lateCount || 0), 0);
    const totalStudentsMarked = sessions.reduce((acc, s) => acc + (s.totalStudents || 0), 0);
    const avgAttendanceRate =
        totalStudentsMarked > 0
            ? Math.round(((totalPresentSum + totalLateSum) / totalStudentsMarked) * 100)
            : 0;

    return (
        <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md shadow-[#03204c]/20">
                                <UserCheck className="h-5 w-5" />
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                Assigned Class Attendance Records
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            View and inspect recorded attendance sessions for your assigned classes and subjects.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs">
                        <Users className="h-4 w-4 text-[#03204c]" />
                        <span>Teacher Portal • Assigned Classes Only</span>
                    </div>
                </div>

                {/* No Assignment Notice */}
                {!loadingAssignments && assignments.length === 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-6 text-center shadow-xs">
                        <h3 className="text-base font-bold text-amber-900">No Assigned Classes or Subjects</h3>
                        <p className="mt-1 text-sm text-amber-700 max-w-lg mx-auto">
                            You currently have no class or subject assignments. Attendance records will be visible here once an administrator assigns classes to you.
                        </p>
                    </div>
                )}

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                        <span className="text-xs font-semibold text-slate-500">Total Sessions</span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-slate-900">{totalSessionsRecorded}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Total Present Marked
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-emerald-700">{totalPresentSum}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Total Absent Marked
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-rose-700">{totalAbsentSum}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Avg Attendance Rate
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-blue-700">{avgAttendanceRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Filter className="h-3.5 w-3.5 text-[#03204c]" /> Filter Assigned Records
                        </h2>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                            <RotateCcw className="h-3 w-3" /> Reset Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        {/* Assigned Class Filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Assigned Class</label>
                            <select
                                value={filterClass}
                                onChange={(e) => {
                                    setFilterClass(e.target.value);
                                    setFilterSection("All");
                                    setFilterSubject("All");
                                }}
                                disabled={loadingAssignments || assignments.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c] disabled:opacity-50"
                            >
                                {assignedClassOptions.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Section Filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Assigned Section</label>
                            <select
                                value={filterSection}
                                onChange={(e) => setFilterSection(e.target.value)}
                                disabled={loadingAssignments || assignments.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c] disabled:opacity-50"
                            >
                                {assignedSectionOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s === "All" ? "All Sections" : `Section ${s}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Subject Filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Assigned Subject</label>
                            <select
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                disabled={loadingAssignments || assignments.length === 0}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c] disabled:opacity-50"
                            >
                                {assignedSubjectOptions.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub === "All" ? "All Subjects" : sub}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Student / Roll */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Search Student</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Name or Roll..."
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#03204c]"
                                />
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Specific Date</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#03204c]"
                            />
                        </div>

                        {/* Month Filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Month</label>
                            <input
                                type="month"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#03204c]"
                            />
                        </div>
                    </div>
                </div>

                {/* Attendance Sessions Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 p-4">
                        <span className="text-sm font-bold text-slate-800">
                            Recorded Attendance Sessions ({sessions.length} sessions found)
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4">Date</th>
                                    <th className="py-3.5 px-4">Class & Section</th>
                                    <th className="py-3.5 px-4">Subject</th>
                                    <th className="py-3.5 px-4 text-center">Present</th>
                                    <th className="py-3.5 px-4 text-center">Absent</th>
                                    <th className="py-3.5 px-4 text-center">Late</th>
                                    <th className="py-3.5 px-4 text-center">Rate</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            Loading attendance records from database...
                                        </td>
                                    </tr>
                                ) : sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            No attendance records found in the database for the selected filters.
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.map((item) => {
                                        const rate =
                                            item.totalStudents > 0
                                                ? Math.round(
                                                      ((item.presentCount + (item.lateCount || 0)) / item.totalStudents) * 100
                                                  )
                                                : 0;

                                        return (
                                            <tr key={item._id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-3.5 px-4 font-semibold text-slate-800">
                                                    {item.date}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                                                        Class {item.className}-{item.section}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 font-medium text-slate-700">
                                                    {item.subject}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                                                        {item.presentCount}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                                                        {item.absentCount}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                                                        {item.lateCount || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span
                                                        className={`text-xs font-bold ${
                                                            rate >= 80
                                                                ? "text-emerald-600"
                                                                : rate >= 60
                                                                ? "text-amber-600"
                                                                : "text-rose-600"
                                                        }`}
                                                    >
                                                        {rate}%
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedSession(item)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-[#03204c]/20 bg-[#03204c]/5 px-2.5 py-1 text-xs font-semibold text-[#03204c] hover:bg-[#03204c]/10 transition"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" /> View Roster
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Student Breakdown Modal with AI 75% Warning */}
                {selectedSession && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/70">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Attendance Detail • Class {selectedSession.className}-{selectedSession.section}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Subject: <span className="font-semibold text-slate-700">{selectedSession.subject}</span> | Date: <span className="font-semibold text-slate-700">{selectedSession.date}</span> | Recorded By: <span className="font-semibold text-slate-700">{selectedSession.teacherName}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 font-bold transition"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-5">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="py-2.5 px-3">Roll</th>
                                            <th className="py-2.5 px-3">Student Name</th>
                                            <th className="py-2.5 px-3 text-center">Status</th>
                                            <th className="py-2.5 px-3 text-center">AI 75% Advisory Action</th>
                                            <th className="py-2.5 px-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedSession.records && selectedSession.records.length > 0 ? (
                                            selectedSession.records.map((r, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition">
                                                    <td className="py-2.5 px-3 font-bold text-slate-700">{r.roll}</td>
                                                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                                                        <div>{r.studentName}</div>
                                                        {r.studentEmail && (
                                                            <div className="text-[11px] text-slate-400">{r.studentEmail}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                r.status === "PRESENT"
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                    : r.status === "ABSENT"
                                                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                                    : r.status === "LATE"
                                                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                                    : "bg-purple-50 text-purple-700 border border-purple-200"
                                                            }`}
                                                        >
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        {r.status === "ABSENT" ? (
                                                            <button
                                                                type="button"
                                                                disabled={generatingStudentId === r.studentId}
                                                                onClick={() => handleSendAiWarning(r)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-rose-700 transition disabled:opacity-50"
                                                            >
                                                                <Sparkles className="h-3.5 w-3.5" />
                                                                {generatingStudentId === r.studentId
                                                                    ? "Evaluating & Sending..."
                                                                    : "AI 75% Notice"}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-slate-500">{r.remarks || "—"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-6 text-center text-slate-400">
                                                    No individual student records stored in this session.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end border-t border-slate-100 p-4 bg-slate-50/50">
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="rounded-xl bg-[#03204c] px-5 py-2 text-xs font-bold text-white hover:bg-[#02183a] transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Warning Result Modal */}
                {aiResultNotice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
                            {/* Modal Header */}
                            <div className={`p-5 flex items-start justify-between border-b ${
                                !aiResultNotice.isEligibleForExam
                                    ? "bg-rose-50/80 border-rose-100 text-rose-950"
                                    : "bg-emerald-50/80 border-emerald-100 text-emerald-950"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <span className={`p-2 rounded-xl ${
                                        !aiResultNotice.isEligibleForExam ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                                    }`}>
                                        <Sparkles className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-bold">
                                            {aiResultNotice.title || "AI Attendance Advisory Notice"}
                                        </h3>
                                        <p className="text-xs opacity-80">
                                            Recipient: {aiResultNotice.studentName} (Roll: {aiResultNotice.roll || "N/A"})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAiResultNotice(null)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-white/60 hover:text-slate-700 font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Eligibility Banner */}
                            <div className="p-5 space-y-4">
                                <div className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold ${
                                    !aiResultNotice.isEligibleForExam
                                        ? "bg-rose-50 text-rose-800 border-rose-200"
                                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {!aiResultNotice.isEligibleForExam ? (
                                            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                        )}
                                        <span>
                                            Attendance Rate: <strong>{aiResultNotice.attendancePercentage}%</strong> (Min Threshold: 75%)
                                        </span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] uppercase ${
                                        !aiResultNotice.isEligibleForExam
                                            ? "bg-rose-600 text-white"
                                            : "bg-emerald-600 text-white"
                                    }`}>
                                        {!aiResultNotice.isEligibleForExam ? "❌ Ineligible for Exam" : "✅ Exam Eligible"}
                                    </span>
                                </div>

                                {/* AI Message Body */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap font-sans shadow-2xs">
                                    {aiResultNotice.message}
                                </div>

                                <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                                    <span>
                                        This official advisory has been generated with Gemini AI and dispatched directly to the student&apos;s attendance dashboard.
                                    </span>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end border-t border-slate-100 p-4 bg-slate-50/50">
                                <button
                                    onClick={() => setAiResultNotice(null)}
                                    className="rounded-xl bg-[#03204c] px-5 py-2 text-xs font-bold text-white hover:bg-[#02183a] transition shadow-xs"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

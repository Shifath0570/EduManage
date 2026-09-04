"use client";

import React, { useState, useEffect, useCallback } from "react";
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
    Sparkles
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

const CLASS_OPTIONS = [
    { value: "All", label: "All Classes" },
    { value: "1", label: "Class 1" },
    { value: "2", label: "Class 2" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
    { value: "5", label: "Class 5" },
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
];

const SECTION_OPTIONS = ["All", "A", "B", "C", "D"];

// Standard institutional attendance threshold target (75%)
const ATTENDANCE_THRESHOLD_PERCENTAGE = 75;

const SUBJECT_OPTIONS = [
    "All",
    "Mathematics",
    "English",
    "Bangla",
    "General Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics",
    "ICT",
    "Social Science",
    "Accounting",
    "Business Entrepreneurship"
];

export default function TeacherViewAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterClass, setFilterClass] = useState<string>("All");
    const [filterSection, setFilterSection] = useState<string>("All");
    const [filterSubject, setFilterSubject] = useState<string>("All");
    const [filterSearch, setFilterSearch] = useState<string>("");
    const [filterDate, setFilterDate] = useState<string>("");
    const [filterMonth, setFilterMonth] = useState<string>("");
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchAttendanceData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterClass !== "All") params.append("className", filterClass);
            if (filterSection !== "All") params.append("section", filterSection);
            if (filterSubject !== "All") params.append("subject", filterSubject);
            if (filterSearch.trim()) params.append("search", filterSearch.trim());
            if (filterDate) params.append("date", filterDate);
            if (filterMonth) params.append("month", filterMonth);

            const res = await fetch(`${API_BASE}/api/attendance?${params.toString()}`);
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
    }, [filterClass, filterSection, filterSubject, filterSearch, filterDate, filterMonth, API_BASE]);

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
                                Class Attendance Records
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            View and inspect recorded attendance sessions dynamically across Class 1 to 10.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs">
                        <Users className="h-4 w-4 text-[#03204c]" />
                        <span>Teacher Portal • Class 1 to 10</span>
                    </div>
                </div>

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
                            <Filter className="h-3.5 w-3.5 text-[#03204c]" /> Filter Records (Class 1–10)
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
                        {/* Class filter: 1 to 10 */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Class</label>
                            <select
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c]"
                            >
                                {CLASS_OPTIONS.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Section filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Section</label>
                            <select
                                value={filterSection}
                                onChange={(e) => setFilterSection(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c]"
                            >
                                {SECTION_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s === "All" ? "All Sections" : `Section ${s}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject filter */}
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Subject</label>
                            <select
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#03204c]"
                            >
                                {SUBJECT_OPTIONS.map((sub) => (
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

                {/* Student Breakdown Modal */}
                {selectedSession && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Attendance Detail • Class {selectedSession.className}-{selectedSession.section}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Subject: {selectedSession.subject} | Date: {selectedSession.date} | Recorded By: {selectedSession.teacherName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 font-bold"
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
                                            <th className="py-2.5 px-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedSession.records && selectedSession.records.length > 0 ? (
                                            selectedSession.records.map((r, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
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
                                                    <td className="py-2.5 px-3 text-xs text-slate-500">{r.remarks || "—"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-6 text-center text-slate-400">
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

            </div>
        </div>
    );
}

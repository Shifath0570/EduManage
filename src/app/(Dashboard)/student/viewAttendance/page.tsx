"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    BookOpen,
    Sparkles,
    Filter,
    RotateCcw
} from "lucide-react";

interface SubjectStat {
    subject: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    percentage: number;
}

interface AttendanceHistoryItem {
    sessionId: string;
    className: string;
    section: string;
    subject: string;
    date: string;
    teacherName: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
}

export default function StudentViewAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [summary, setSummary] = useState({
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        attendancePercentage: 0
    });

    const [subjectBreakdown, setSubjectBreakdown] = useState<SubjectStat[]>([]);
    const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");
    const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("");

    const API_BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
            ? "https://edu-manage-server-blush.vercel.app"
            : "http://localhost:5000");

    const fetchStudentAttendance = useCallback(async () => {
        if (!user?.email && !user?.name) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const identifier = user.email || user.name || "";
            const res = await fetch(`${API_BASE}/api/attendance/student/${encodeURIComponent(identifier)}`);
            const data = await res.json();

            if (data.success && data.data) {
                setSummary(data.data.summary || {
                    totalClasses: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    attendancePercentage: 0
                });
                setSubjectBreakdown(data.data.subjectBreakdown || []);
                setHistory(data.data.history || []);
            } else {
                setSummary({
                    totalClasses: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    attendancePercentage: 0
                });
                setSubjectBreakdown([]);
                setHistory([]);
            }
        } catch (err) {
            console.error("Error fetching student attendance:", err);
            setSummary({
                totalClasses: 0,
                present: 0,
                absent: 0,
                late: 0,
                excused: 0,
                attendancePercentage: 0
            });
            setSubjectBreakdown([]);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, [user, API_BASE]);

    useEffect(() => {
        fetchStudentAttendance();
    }, [fetchStudentAttendance]);

    // Filter history records
    const filteredHistory = history.filter((item) => {
        if (selectedSubjectFilter !== "All" && item.subject !== selectedSubjectFilter) return false;
        if (selectedMonthFilter && !item.date.startsWith(selectedMonthFilter)) return false;
        return true;
    });

    const isGoodStanding = summary.attendancePercentage >= 75;

    return (
        <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md shadow-[#03204c]/20">
                                <User className="h-5 w-5" />
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                My Attendance Record
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Track your personal class attendance record and subject participation metrics in real time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs">
                        <span>Student: <strong className="text-slate-900">{user?.name || "Student"}</strong></span>
                    </div>
                </div>

                {/* KPI Overview Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {/* Total Classes */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                        <span className="text-xs font-semibold text-slate-500">Total Classes</span>
                        <div className="mt-1">
                            <span className="text-3xl font-extrabold text-slate-900">{summary.totalClasses}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">All recorded sessions</span>
                    </div>

                    {/* Present */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Present
                        </span>
                        <div className="mt-1">
                            <span className="text-3xl font-extrabold text-emerald-700">{summary.present}</span>
                        </div>
                        <span className="text-[11px] text-emerald-600/80">Attended classes</span>
                    </div>

                    {/* Absent */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Absent
                        </span>
                        <div className="mt-1">
                            <span className="text-3xl font-extrabold text-rose-700">{summary.absent}</span>
                        </div>
                        <span className="text-[11px] text-rose-600/80">Missed days</span>
                    </div>

                    {/* Late */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Late
                        </span>
                        <div className="mt-1">
                            <span className="text-3xl font-extrabold text-amber-700">{summary.late}</span>
                        </div>
                        <span className="text-[11px] text-amber-600/80">Late arrivals</span>
                    </div>

                    {/* Overall Attendance Percentage */}
                    <div className="rounded-2xl border border-[#03204c]/20 bg-[#03204c]/5 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-[#03204c] flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Attendance
                        </span>
                        <div className="mt-1">
                            <span className="text-3xl font-extrabold text-[#03204c]">{summary.attendancePercentage}%</span>
                        </div>
                        <span className={`text-[11px] font-bold ${summary.totalClasses === 0 ? "text-slate-400" : isGoodStanding ? "text-emerald-600" : "text-rose-600"}`}>
                            {summary.totalClasses === 0 ? "No classes marked" : isGoodStanding ? "✓ Satisfactory (≥75%)" : "⚠ Below Requirement (<75%)"}
                        </span>
                    </div>
                </div>

                {/* Progress Bar Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Attendance Percentage</span>
                        <span className="text-sm font-bold text-slate-800">{summary.attendancePercentage}% (Minimum Target: 75%)</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                summary.attendancePercentage >= 85
                                    ? "bg-emerald-500"
                                    : summary.attendancePercentage >= 75
                                    ? "bg-blue-500"
                                    : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(summary.attendancePercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Subject-Wise Breakdown */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-[#03204c]" />
                        Subject-Wise Attendance Breakdown
                    </h2>

                    {subjectBreakdown.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                            No subject-specific attendance recorded in the database yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {subjectBreakdown.map((sb, idx) => (
                                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-slate-800">{sb.subject}</span>
                                        <span
                                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                sb.percentage >= 85
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : sb.percentage >= 75
                                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                            }`}
                                        >
                                            {sb.percentage}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex justify-between">
                                        <span>Present: <strong>{sb.present}</strong></span>
                                        <span>Absent: <strong>{sb.absent}</strong></span>
                                        <span>Total: <strong>{sb.total}</strong></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#03204c] rounded-full"
                                            style={{ width: `${Math.min(sb.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attendance Log Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Attendance Log History
                            </h3>
                            <p className="text-xs text-slate-400">
                                Real-time history of your individual attendance status
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={selectedSubjectFilter}
                                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                            >
                                <option value="All">All Subjects</option>
                                {subjectBreakdown.map((sb, idx) => (
                                    <option key={idx} value={sb.subject}>{sb.subject}</option>
                                ))}
                            </select>

                            <input
                                type="month"
                                value={selectedMonthFilter}
                                onChange={(e) => setSelectedMonthFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1 text-xs text-slate-700 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Class</th>
                                    <th className="py-3 px-4">Subject</th>
                                    <th className="py-3 px-4">Teacher</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">Loading records...</td>
                                    </tr>
                                ) : filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            No attendance records recorded for your account yet.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 transition">
                                            <td className="py-3 px-4 font-semibold text-slate-800">{item.date}</td>
                                            <td className="py-3 px-4">
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                                    Class {item.className}-{item.section}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-700">{item.subject}</td>
                                            <td className="py-3 px-4 text-xs text-slate-500">{item.teacherName}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        item.status === "PRESENT"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : item.status === "ABSENT"
                                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                            : item.status === "LATE"
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-purple-50 text-purple-700 border border-purple-200"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-400">{item.remarks || "—"}</td>
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

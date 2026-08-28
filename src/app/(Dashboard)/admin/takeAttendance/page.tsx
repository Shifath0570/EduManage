"use client";

import React, { useState, useEffect } from "react";
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
    Shield,
    RotateCcw
} from "lucide-react";

interface StudentRecord {
    studentId: string;
    studentName: string;
    studentEmail: string;
    roll: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
}

interface TeacherItem {
    _id: string;
    name: string;
    email: string;
    subjects: string[];
    className: string;
    section: string;
}

export default function AdminTakeAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [classes] = useState<string[]>(["6", "7", "8", "9", "10", "11", "12"]);
    const [sections] = useState<string[]>(["A", "B", "C", "D"]);
    const [subjects] = useState<string[]>([
        "Mathematics",
        "English",
        "Bangla",
        "Science",
        "Physics",
        "Chemistry",
        "Biology",
        "ICT",
        "Social Science",
        "History"
    ]);

    const [teachers, setTeachers] = useState<TeacherItem[]>([]);
    const [selectedTeacherEmail, setSelectedTeacherEmail] = useState<string>("");

    const [selectedClass, setSelectedClass] = useState<string>("10");
    const [selectedSection, setSelectedSection] = useState<string>("A");
    const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch teachers list for Admin attribution
    useEffect(() => {
        async function fetchTeachers() {
            try {
                const res = await fetch(`${API_BASE}/api/teachers?limit=50`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setTeachers(data.data);
                    if (data.data.length > 0) {
                        setSelectedTeacherEmail(data.data[0].email);
                    }
                }
            } catch (err) {
                console.error("Error fetching teachers list:", err);
            }
        }
        fetchTeachers();
    }, [API_BASE]);

    // Load student roster or existing saved attendance session
    useEffect(() => {
        if (!selectedClass || !selectedSection || !selectedSubject || !selectedDate) return;

        async function loadRoster() {
            setLoadingStudents(true);
            setMessage(null);
            try {
                // Check if attendance is already saved for this session
                const attRes = await fetch(
                    `${API_BASE}/api/attendance?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}&subject=${encodeURIComponent(selectedSubject)}&date=${encodeURIComponent(selectedDate)}`
                );
                const attData = await attRes.json();

                if (attData.success && attData.data && attData.data.length > 0) {
                    const sessionData = attData.data[0];
                    setStudents(sessionData.records || []);
                    if (sessionData.teacherEmail) {
                        setSelectedTeacherEmail(sessionData.teacherEmail);
                    }
                    setMessage({
                        type: "success",
                        text: `Loaded existing attendance session (${sessionData.records.length} students marked).`
                    });
                } else {
                    // Fetch student roster for this class and section
                    const stuRes = await fetch(
                        `${API_BASE}/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`
                    );
                    const stuData = await stuRes.json();

                    if (stuData.success && Array.isArray(stuData.data) && stuData.data.length > 0) {
                        const formatted = stuData.data.map((s: { studentId?: string; _id?: string; name: string; email?: string; roll: string }) => ({
                            studentId: s.studentId || s._id || `STU-${s.roll}`,
                            studentName: s.name,
                            studentEmail: s.email || "",
                            roll: s.roll,
                            status: "PRESENT" as const,
                            remarks: ""
                        }));
                        setStudents(formatted);
                    } else {
                        // Fallback sample roster
                        setStudents([
                            { studentId: "STU-1001", studentName: "Rahim Ahmed", studentEmail: "rahim@example.com", roll: "01", status: "PRESENT", remarks: "" },
                            { studentId: "STU-1002", studentName: "Karim Chowdhury", studentEmail: "karim@example.com", roll: "02", status: "ABSENT", remarks: "" },
                            { studentId: "STU-1003", studentName: "Hasan Mahmud", studentEmail: "hasan@example.com", roll: "03", status: "PRESENT", remarks: "" },
                            { studentId: "STU-1004", studentName: "Ahmed Faruk", studentEmail: "ahmed@example.com", roll: "04", status: "LATE", remarks: "" },
                            { studentId: "STU-1005", studentName: "Sakib Al Hasan", studentEmail: "sakib@example.com", roll: "05", status: "PRESENT", remarks: "" }
                        ]);
                    }
                }
            } catch (err) {
                console.error("Error loading roster:", err);
                setStudents([
                    { studentId: "STU-1001", studentName: "Rahim Ahmed", studentEmail: "rahim@example.com", roll: "01", status: "PRESENT", remarks: "" },
                    { studentId: "STU-1002", studentName: "Karim Chowdhury", studentEmail: "karim@example.com", roll: "02", status: "ABSENT", remarks: "" },
                    { studentId: "STU-1003", studentName: "Hasan Mahmud", studentEmail: "hasan@example.com", roll: "03", status: "PRESENT", remarks: "" }
                ]);
            } finally {
                setLoadingStudents(false);
            }
        }

        loadRoster();
    }, [selectedClass, selectedSection, selectedSubject, selectedDate, API_BASE]);

    const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
        setStudents(prev =>
            prev.map(s => s.studentId === studentId ? { ...s, status } : s)
        );
    };

    const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSaveAttendance = async () => {
        if (students.length === 0) {
            alert("No students to save attendance for.");
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const assignedTeacher = teachers.find(t => t.email === selectedTeacherEmail);
            const payload = {
                className: selectedClass,
                section: selectedSection,
                subject: selectedSubject,
                date: selectedDate,
                teacherEmail: selectedTeacherEmail || user?.email || "admin@edumanage.com",
                teacherName: assignedTeacher?.name || user?.name || "Admin",
                records: students
            };

            const res = await fetch(`${API_BASE}/api/attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setMessage({
                    type: "success",
                    text: `Attendance saved successfully for Class ${selectedClass}-${selectedSection} (${selectedSubject})!`
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

    const presentCount = students.filter(s => s.status === "PRESENT").length;
    const absentCount = students.filter(s => s.status === "ABSENT").length;
    const lateCount = students.filter(s => s.status === "LATE").length;
    const excusedCount = students.filter(s => s.status === "EXCUSED").length;
    const attendancePercentage = students.length > 0
        ? Math.round(((presentCount + lateCount) / students.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                                <Shield className="h-4 w-4" />
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                Admin Take Attendance
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Full school access to record or override attendance for any class, section, and subject.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/80 px-3.5 py-2 text-xs font-semibold text-purple-800">
                        <Shield className="h-4 w-4 text-purple-600 shrink-0" />
                        <span>Administrator Mode • All Classes Unlocked</span>
                    </div>
                </div>

                {/* Configuration Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-purple-600" />
                        Select Class, Section & Subject
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Class */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                            >
                                {classes.map(c => (
                                    <option key={c} value={c}>Class {c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Select Section
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                            >
                                {sections.map(s => (
                                    <option key={s} value={s}>Section {s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Select Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                            >
                                {subjects.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Teacher (Optional attribution) */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Teacher In Charge
                            </label>
                            <select
                                value={selectedTeacherEmail}
                                onChange={(e) => setSelectedTeacherEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                            >
                                <option value="">Assign To Teacher</option>
                                {teachers.map(t => (
                                    <option key={t._id} value={t.email}>
                                        {t.name} (Class {t.className}-{t.section})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Selector */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                                />
                                <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {message && (
                    <div
                        className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
                            message.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Live Stat KPI Cards */}
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

                    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Attendance Rate
                        </span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold text-purple-700">{attendancePercentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
                    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Student Roster • Class {selectedClass}-{selectedSection}
                            </h3>
                            <p className="text-xs text-slate-400">
                                Subject: {selectedSubject} | Date: {selectedDate}
                            </p>
                        </div>

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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4">Roll</th>
                                    <th className="py-3.5 px-4">Student Name</th>
                                    <th className="py-3.5 px-4 text-center">Status</th>
                                    <th className="py-3.5 px-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingStudents ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            Loading student roster...
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            No students found for this class and section.
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
                                                        setStudents(prev =>
                                                            prev.map(s => s.studentId === student.studentId ? { ...s, remarks: val } : s)
                                                        );
                                                    }}
                                                    className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-purple-500 focus:bg-white"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/40">
                        <div className="text-xs text-slate-500">
                            Administrator: <span className="font-semibold text-slate-800">{user?.name || "Admin"}</span> ({user?.email})
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveAttendance}
                            disabled={saving || students.length === 0}
                            className="flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? "Saving to Database..." : "Save Admin Attendance"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

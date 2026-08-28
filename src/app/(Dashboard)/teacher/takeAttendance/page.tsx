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
    ShieldAlert
} from "lucide-react";

interface StudentRecord {
    studentId: string;
    studentName: string;
    studentEmail: string;
    roll: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
}

interface TeacherProfile {
    _id?: string;
    teacherId?: number;
    name?: string;
    email: string;
    className: string;
    section: string;
    subjects: string[];
}

export default function TeacherTakeAttendance() {
    const { data: session } = useSession();
    const user = session?.user;

    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch logged in teacher's profile to extract assigned classes and subjects
    useEffect(() => {
        async function fetchTeacherProfile() {
            setLoadingProfile(true);
            try {
                const teacherEmail = user?.email || "";
                if (teacherEmail) {
                    const res = await fetch(`${API_BASE}/api/teachers?search=${encodeURIComponent(teacherEmail)}`);
                    const data = await res.json();
                    if (data.success && data.data && data.data.length > 0) {
                        const found = data.data.find(
                            (t: TeacherProfile) => t.email.toLowerCase() === teacherEmail.toLowerCase()
                        ) || data.data[0];
                        setTeacherProfile(found);
                        setSelectedClass(found.className || "10");
                        setSelectedSection(found.section || "A");
                        if (found.subjects && found.subjects.length > 0) {
                            setSelectedSubject(found.subjects[0]);
                        }
                    } else {
                        // Fallback default teacher assignments if profile record isn't found
                        const defaultAssigned: TeacherProfile = {
                            email: teacherEmail || "teacher@example.com",
                            name: user?.name || "Teacher",
                            className: "10",
                            section: "A",
                            subjects: ["Mathematics", "Science", "English"]
                        };
                        setTeacherProfile(defaultAssigned);
                        setSelectedClass(defaultAssigned.className);
                        setSelectedSection(defaultAssigned.section);
                        setSelectedSubject(defaultAssigned.subjects[0]);
                    }
                } else {
                    const fallbackAssigned: TeacherProfile = {
                        email: "teacher@example.com",
                        name: "Teacher",
                        className: "10",
                        section: "A",
                        subjects: ["Mathematics", "Science", "English"]
                    };
                    setTeacherProfile(fallbackAssigned);
                    setSelectedClass(fallbackAssigned.className);
                    setSelectedSection(fallbackAssigned.section);
                    setSelectedSubject(fallbackAssigned.subjects[0]);
                }
            } catch (err) {
                console.error("Error fetching teacher profile:", err);
                const fallbackAssigned: TeacherProfile = {
                    email: user?.email || "teacher@example.com",
                    name: user?.name || "Teacher",
                    className: "10",
                    section: "A",
                    subjects: ["Mathematics", "Science", "English"]
                };
                setTeacherProfile(fallbackAssigned);
                setSelectedClass(fallbackAssigned.className);
                setSelectedSection(fallbackAssigned.section);
                setSelectedSubject(fallbackAssigned.subjects[0]);
            } finally {
                setLoadingProfile(false);
            }
        }

        fetchTeacherProfile();
    }, [user, API_BASE]);

    // Load student list or existing saved attendance when class/section/subject/date is selected
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
                        // Fallback sample roster if none registered in DB yet
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
                    { studentId: "STU-1003", studentName: "Hasan Mahmud", studentEmail: "hasan@example.com", roll: "03", status: "PRESENT", remarks: "" },
                    { studentId: "STU-1004", studentName: "Ahmed Faruk", studentEmail: "ahmed@example.com", roll: "04", status: "LATE", remarks: "" },
                    { studentId: "STU-1005", studentName: "Sakib Al Hasan", studentEmail: "sakib@example.com", roll: "05", status: "PRESENT", remarks: "" }
                ]);
            } finally {
                setLoadingStudents(false);
            }
        }

        loadRoster();
    }, [selectedClass, selectedSection, selectedSubject, selectedDate, API_BASE]);

    // Status change for individual student
    const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
        setStudents(prev =>
            prev.map(s => s.studentId === studentId ? { ...s, status } : s)
        );
    };

    // Bulk status updates
    const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    // Save Attendance to Backend
    const handleSaveAttendance = async () => {
        if (students.length === 0) {
            alert("No students to save attendance for.");
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
                teacherEmail: user?.email || teacherProfile?.email || "teacher@example.com",
                teacherName: user?.name || teacherProfile?.name || "Teacher",
                records: students
            };

            const res = await fetch(`${API_BASE}/api/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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

    // Live Metrics
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
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                <BookOpen className="h-4 w-4" />
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                Take Attendance
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Mark and record daily student attendance for your assigned class & subjects.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs font-medium text-amber-800">
                        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Restricted to your assigned classes & subjects</span>
                    </div>
                </div>

                {/* Selection Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-indigo-600" />
                        Session Configuration
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Assigned Class */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Assigned Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {teacherProfile?.className ? (
                                    <option value={teacherProfile.className}>
                                        Class {teacherProfile.className}
                                    </option>
                                ) : (
                                    <>
                                        <option value="10">Class 10</option>
                                        <option value="9">Class 9</option>
                                    </>
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
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {teacherProfile?.section ? (
                                    <option value={teacherProfile.section}>
                                        Section {teacherProfile.section}
                                    </option>
                                ) : (
                                    <>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                    </>
                                )}
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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {teacherProfile?.subjects && teacherProfile.subjects.length > 0 ? (
                                    teacherProfile.subjects.map((sub, idx) => (
                                        <option key={idx} value={sub}>
                                            {sub}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Date Selector */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Attendance Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
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

                    {/* Table */}
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
                                                    className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
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
                            Recording as: <span className="font-semibold text-slate-800">{user?.name || teacherProfile?.name || "Teacher"}</span> ({user?.email || teacherProfile?.email})
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

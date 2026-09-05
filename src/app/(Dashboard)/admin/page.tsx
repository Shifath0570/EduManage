
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@heroui/react";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  ArrowUpRight,
  UserPlus,
  Calendar,
  FileText,
  Clock,
  Search,
  Bell,
  Menu,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Data Types
interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  studentGrowth: string;
  teacherGrowth: string;
  classGrowth: string;
  subjectGrowth: string;
}

interface StudentGenderStats {
  male: number;
  female: number;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
}

interface AttendanceTrend {
  day: string;
  rate: number;
}

interface Student {
  id: string;
  name: string;
  class: string;
  email: string;
  status: string;
  avatar?: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

interface EventItem {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  fullDate: string;
  colorClass: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);

  // Initial / Default Dynamic Data Matching Design
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 32,
    totalSubjects: 48,
    studentGrowth: "12% this month",
    teacherGrowth: "5% this month",
    classGrowth: "3 this year",
    subjectGrowth: "8 this year",
  });

  const [studentGender, setStudentGender] = useState<StudentGenderStats>({
    male: 650,
    female: 600,
  });

  const [todayAttendance, setTodayAttendance] = useState<AttendanceStats>({
    present: 1150,
    absent: 62,
    late: 38,
  });

  const [weeklyAttendance, setWeeklyAttendance] = useState<AttendanceTrend[]>([
    { day: "Mon", rate: 90 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 93 },
    { day: "Thu", rate: 91 },
    { day: "Fri", rate: 94 },
    { day: "Sat", rate: 88 },
    { day: "Sun", rate: 85 },
  ]);

  const [recentStudents, setRecentStudents] = useState<Student[]>([
    { id: "1", name: "Ahmed Rahman", class: "Class 10", email: "ahmed@gmail.com", status: "Active" },
    { id: "2", name: "Karim Hasan", class: "Class 9", email: "karim@gmail.com", status: "Active" },
    { id: "3", name: "Sadia Akter", class: "Class 8", email: "sadia@gmail.com", status: "Active" },
    { id: "4", name: "Nusrat Jahan", class: "Class 10", email: "nusrat@gmail.com", status: "Active" },
    { id: "5", name: "Rafiul Islam", class: "Class 7", email: "rafiul@gmail.com", status: "Active" },
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    { id: "1", type: "student", title: "New student added", description: "Ahmed Rahman was added by Admin", time: "10 minutes ago" },
    { id: "2", type: "teacher", title: "New teacher added", description: "Md. Osman Goni joined the school", time: "1 hour ago" },
    { id: "3", type: "class", title: "Class updated", description: "Class 10 Science was updated", time: "2 hours ago" },
    { id: "4", type: "assignment", title: "New assignment created", description: "Mathematics assignment for Class 9", time: "3 hours ago" },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([
    { id: "1", dateDay: "08", dateMonth: "Sep", title: "Mid-Term Examination", fullDate: "Monday, 08 September 2024", colorClass: "bg-blue-600" },
    { id: "2", dateDay: "12", dateMonth: "Sep", title: "Parent-Teacher Meeting", fullDate: "Friday, 12 September 2024", colorClass: "bg-emerald-600" },
    { id: "3", dateDay: "15", dateMonth: "Sep", title: "Sports Day", fullDate: "Monday, 15 September 2024", colorClass: "bg-amber-500" },
    { id: "4", dateDay: "20", dateMonth: "Sep", title: "Science Fair", fullDate: "Saturday, 20 September 2024", colorClass: "bg-purple-600" },
  ]);

  useEffect(() => {
    // Dynamic Fetch Example from Backend
    const fetchDashboardData = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiURL}/api/admin/dashboard-stats`);
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.studentGender) setStudentGender(data.studentGender);
          if (data.todayAttendance) setTodayAttendance(data.todayAttendance);
          if (data.weeklyAttendance) setWeeklyAttendance(data.weeklyAttendance);
          if (data.recentStudents) setRecentStudents(data.recentStudents);
          if (data.recentActivities) setRecentActivities(data.recentActivities);
          if (data.upcomingEvents) setUpcomingEvents(data.upcomingEvents);
        }
      } catch (err) {
        console.log("Using default overview state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculation Helpers
  const totalStudentsCount = studentGender.male + studentGender.female;
  const totalAttendanceCount = todayAttendance.present + todayAttendance.absent + todayAttendance.late;
  const presentPercentage = Math.round((todayAttendance.present / totalAttendanceCount) * 100);

  // Donut Chart Data
  const genderChartData = [
    { name: "Male", value: studentGender.male, color: "#2563eb" },
    { name: "Female", value: studentGender.female, color: "#ec4899" },
  ];

  const attendanceChartData = [
    { name: "Present", value: todayAttendance.present, color: "#22c55e" },
    { name: "Absent", value: todayAttendance.absent, color: "#ef4444" },
    { name: "Late", value: todayAttendance.late, color: "#f59e0b" },
  ];

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-slate-500 lg:hidden cursor-pointer" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Overview</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Welcome back, Admin! Here is what happening in your school today.
          </p>
        </div>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Students */}
        <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Students</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {stats.totalStudents.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{stats.studentGrowth}</span>
          </div>
        </Card>

        {/* Total Teachers */}
        <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Teachers</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {stats.totalTeachers.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{stats.teacherGrowth}</span>
          </div>
        </Card>

        {/* Total Classes */}
        <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Classes</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {stats.totalClasses.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-purple-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{stats.classGrowth}</span>
          </div>
        </Card>

        {/* Total Subjects */}
        <Card className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Subjects</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {stats.totalSubjects.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{stats.subjectGrowth}</span>
          </div>
        </Card>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Student Overview Donut Chart */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Student Overview</h2>
          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-slate-900">
                {totalStudentsCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-xs font-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600">Male Students</span>
              </div>
              <span className="font-semibold text-slate-800">
                {studentGender.male} ({Math.round((studentGender.male / totalStudentsCount) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                <span className="text-slate-600">Female Students</span>
              </div>
              <span className="font-semibold text-slate-800">
                {studentGender.female} ({Math.round((studentGender.female / totalStudentsCount) * 100)}%)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Students</span>
            <span className="font-bold text-slate-900">{totalStudentsCount.toLocaleString()}</span>
          </div>
        </Card>

        {/* Attendance Overview Donut Chart */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Attendance Overview (Today)</h2>
          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attendanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-slate-900">{presentPercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Present</span>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-xs font-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Present</span>
              </div>
              <span className="font-semibold text-slate-800">
                {presentPercentage}% ({todayAttendance.present.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Absent</span>
              </div>
              <span className="font-semibold text-slate-800">
                {Math.round((todayAttendance.absent / totalAttendanceCount) * 100)}% ({todayAttendance.absent})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600">Late</span>
              </div>
              <span className="font-semibold text-slate-800">
                {Math.round((todayAttendance.late / totalAttendanceCount) * 100)}% ({todayAttendance.late})
              </span>
            </div>
          </div>
        </Card>

        {/* Attendance Trend Line Chart */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Attendance Trend (This Week)</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(val) => `${val}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Recent Students</h2>
            <Link href="/admin/manageStudents" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-2">Student Name</th>
                  <th className="pb-2">Class</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-2.5 font-medium text-slate-800 flex items-center gap-2">
                      <img
                        src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=E0F2FE&color=0369A1`}
                        alt={student.name}
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate max-w-[100px]">{student.name}</span>
                    </td>
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">{student.class}</td>
                    <td className="py-2.5 text-slate-500 truncate max-w-[110px]">{student.email}</td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm lg:col-span-1">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  {act.type === "student" && <UserPlus className="h-4 w-4" />}
                  {act.type === "teacher" && <GraduationCap className="h-4 w-4" />}
                  {act.type === "class" && <Building2 className="h-4 w-4" />}
                  {act.type === "assignment" && <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                  <p className="text-[11px] text-slate-500">{act.description}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Upcoming Events</h2>
            <Link href="/admin/events" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 ${evt.colorClass} text-white rounded-xl flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold leading-tight">{evt.dateDay}</span>
                    <span className="text-[9px] uppercase font-semibold leading-tight">{evt.dateMonth}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{evt.title}</h4>
                    <p className="text-[11px] text-slate-400">{evt.fullDate}</p>
                  </div>
                </div>
                <Calendar className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 EduManage. All rights reserved.</p>
        <p>Activate Settings</p>
      </div>
    </div>
  );
}






"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  UserX,
  Trash2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

type UserRole = "STUDENT" | "ADMIN" | string;

// Database document structure interface
interface StudentData {
  stuId?: string;
  studentId?: string;
  name: string;
  className: string;
  section: string;
  roll: string;
  email?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface StudentLeaveRequestItem {
  _id: string;
  userId?: string;
  student: {
    id?: string;
    studentId?: string;
    name: string;
    className?: string;
    section?: string;
    roll?: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  purpose: string;
  applicationText: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface JwtResponse { 
  token?: string; 
  message?: string; 
}

export default function StudentLeaveRequestPage() {
  const { data: session, isPending } = useSession();

  const user = session?.user as
    | {
        id?: string;
        stuId?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: UserRole;
        className?: string;
        section?: string;
        roll?: string;
      }
    | undefined;

  // State to hold fetched student document details
  const [studentInfo, setStudentInfo] = useState<StudentData>({
    name: user?.name || "Student",
    className: "class_1",
    section: "A",
    roll: "0248",
  });

  const [form, setForm] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    purpose: "",
    applicationText: "",
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [requests, setRequests] = useState<StudentLeaveRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Function to retrieve JWT from endpoint
  const getJwt = async (): Promise<string> => { 
    const response = await fetch("/api/auth/token", { 
      credentials: "include", 
      headers: { Accept: "application/json" }, 
    }); 
    const result: JwtResponse = await response.json().catch(() => ({})); 

    if (!response.ok || !result.token) { 
      throw new Error(result.message || "You must be signed in to perform this action."); 
    } 
    return result.token; 
  };

  const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const BACKEND_API_URL = `${apiURL}/api/student-leave-requests`;

  // Safe Date Formatting helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  };

  // 1. Fetch Student Profile by user ID / stuId
  useEffect(() => {
    const fetchStudentData = async () => {
      const studentIdentifier = user?.stuId || user?.id;
      if (!studentIdentifier) return;

      try {
        const token = await getJwt(); 
        const res = await fetch(`${apiURL}/api/students/by-user/${studentIdentifier}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Fallback to wrapper property if wrapped in success payload
          const studentDoc = data.data || data;

          setStudentInfo({
            stuId: studentDoc.stuId || studentDoc._id,
            studentId: studentDoc.studentId || "",
            name: studentDoc.name || user?.name || "Student",
            className: studentDoc.className || user?.className || "class_1",
            section: studentDoc.section || user?.section || "A",
            roll: studentDoc.roll || user?.roll || "0248",
            email: studentDoc.email || user?.email,
            phone: studentDoc.phone,
            guardianName: studentDoc.guardianName,
            guardianPhone: studentDoc.guardianPhone,
          });
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };

    if (session?.user) {
      fetchStudentData();
    }
  }, [session, user, apiURL]);

  // 2. Fetch Submitted Leave Requests
  const fetchLeaveRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const token = await getJwt(); 
      const res = await fetch(BACKEND_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error("Failed to load student leave requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchLeaveRequests();
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Generate Letter via AI Endpoint
  const handleGenerateAI = async () => {
    if (!form.purpose.trim()) {
      alert("Please state the reason for your leave first.");
      return;
    }

    setIsAiGenerating(true);

    try {
      const token = await getJwt(); 
      const res = await fetch("/api/leave/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: "STUDENT",
          studentName: studentInfo.name,
          className: studentInfo.className,
          section: studentInfo.section,
          roll: studentInfo.roll,
          leaveType: form.leaveType,
          startDate: form.startDate,
          endDate: form.endDate,
          purpose: form.purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate draft from AI.");
      }

      if (data.applicationLetter) {
        setForm((prev) => ({ ...prev, applicationText: data.applicationLetter }));
      }
    } catch (err: any) {
      console.error("Client fetch error:", err);
      alert(err.message || "Error connecting to AI service.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Submit Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.applicationText.trim()) {
      alert("Please generate or write an application letter before submitting.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId: user?.id || studentInfo.stuId,
      student: {
        id: user?.id || studentInfo.stuId,
        studentId: studentInfo.studentId,
        name: studentInfo.name,
        className: studentInfo.className,
        section: studentInfo.section,
        roll: studentInfo.roll,
        email: studentInfo.email || user?.email || "",
      },
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      purpose: form.purpose,
      applicationText: form.applicationText,
      status: "pending",
    };

    try {
      const token = await getJwt(); 
      const res = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit leave request.");
      }

      alert("Student Leave Application Submitted Successfully!");

      setForm({
        leaveType: "Sick Leave",
        startDate: "",
        endDate: "",
        purpose: "",
        applicationText: "",
      });

      await fetchLeaveRequests();
      setActiveTab("pending");
    } catch (err: any) {
      console.error("Submit Error:", err);
      alert(err.message || "Failed to submit leave application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete / Cancel Leave Request
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return;

    setDeletingId(id);

    try {
      const token = await getJwt(); 
      const res = await fetch(`${BACKEND_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete request.");
      }

      setRequests((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      console.error("Delete Error:", err);
      alert(err.message || "Failed to delete leave request.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-6 text-slate-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-700">Authenticating session...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl p-8 max-w-sm text-center shadow-xl shadow-emerald-950/5">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-lg font-black text-slate-800">Access Restricted</h2>
          <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
            Please sign in with your student account to request leave.
          </p>
        </div>
      </div>
    );
  }

  // Filter requests corresponding to the current logged in user
  const userRequests = requests.filter(
    (req) =>
      req.userId === user?.id ||
      req.userId === studentInfo.stuId ||
      req.student?.id === user?.id
  );

  const filteredRequests = userRequests.filter((req) => req.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 p-4 lg:p-8 text-slate-800">
      <div className="w-full lg:w-[92%] xl:w-[85%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Request Form */}
        <div className="lg:col-span-7 relative bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-[2rem] shadow-xl shadow-emerald-950/5 p-6 sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="relative z-10 border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Leave Request</h1>
              <Sparkles className="w-5 h-5 fill-emerald-500 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Draft your formal leave application letter for your class teacher using AI assistance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Student Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Student Name
                </span>
                <span className="font-extrabold text-slate-800">{studentInfo.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Class & Section
                </span>
                <span className="font-extrabold text-emerald-700 uppercase">
                  {studentInfo.className} ({studentInfo.section})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Roll No.
                </span>
                <span className="font-medium text-slate-700">{studentInfo.roll}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Student ID
                </span>
                <span className="font-medium text-slate-700">{studentInfo.studentId || "STD0369"}</span>
              </div>
            </div>

            {/* Leave Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleChange}
                    className="w-full appearance-none border border-slate-200 rounded-xl bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual / Personal Leave">Casual / Personal Leave</option>
                    <option value="Family Function">Family Function</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Purpose Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Reason for Leave <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex flex-col sm:block">
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Fever and cold, doctor advised rest"
                  required
                  className="w-full border border-slate-200 rounded-xl bg-slate-50/50 pl-4 sm:pr-44 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isAiGenerating}
                  className="mt-2 sm:mt-0 sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-white" />
                      <span>Generate Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Application Output */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Generated Application Letter
              </label>
              <textarea
                name="applicationText"
                value={form.applicationText}
                onChange={handleChange}
                rows={7}
                placeholder="Click 'Generate Application' above or write your letter here..."
                required
                className="w-full border border-slate-200 rounded-2xl bg-slate-50/30 p-4 text-sm font-medium leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group px-7 py-3 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                )}
                <span>Submit Leave Application</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: History List */}
        <div className="lg:col-span-5 relative bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-[2rem] shadow-xl shadow-emerald-950/5 p-6 sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-teal-200/20 blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Application History</h2>
              <p className="text-xs font-medium text-slate-500">Track status of your applications</p>
            </div>

            <div className="flex bg-slate-100/80 p-1 rounded-full text-xs font-bold self-start xl:self-auto border border-slate-200/50">
              {(["pending", "approved", "rejected"] as const).map((tab) => {
                const count = userRequests.filter((r) => r.status === tab).length;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold text-slate-600">Loading records...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/40">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-500">No {activeTab} applications found.</p>
            </div>
          ) : (
            <div className="relative z-10 space-y-4 max-h-[720px] overflow-y-auto pr-1 scrollbar-none">
              {filteredRequests.map((item) => (
                <div
                  key={item._id}
                  className="border border-slate-200/80 rounded-2xl p-4 hover:border-emerald-300 transition-all bg-white shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-800 text-sm">
                          {item.leaveType}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        <strong className="text-slate-800">Reason:</strong> {item.purpose}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(item.status)}
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        title="Delete request"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <details className="mt-3 group/details border-t border-slate-100 pt-3">
                    <summary className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer list-none flex items-center gap-1 select-none">
                      <span>View Application Letter</span>
                    </summary>
                    <div className="mt-2.5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs font-mono whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {item.applicationText}
                    </div>
                  </details>

                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>Student: {item.student?.name || studentInfo.name}</span>
                    <span>Submitted: {formatDate(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}









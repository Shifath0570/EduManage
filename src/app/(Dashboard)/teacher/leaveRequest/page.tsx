// feath done
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

type UserRole = "TEACHER" | "ADMIN" | string;

interface LeaveRequestItem {
  _id: string;
  userId?: string;
  teacher: {
    name: string;
    department: string;
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

export default function TeacherLeaveRequestPage() {
  const { data: session, isPending } = useSession();

  const user = session?.user as
    | {
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: UserRole;
        department?: string;
      }
    | undefined;

  const [teacherData, setTeacherData] = useState({
    name: user?.name || "Teacher",
    department: user?.department || user?.role || "Faculty",
  });

  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    purpose: "",
    applicationText: "",
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [requests, setRequests] = useState<LeaveRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

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

  const BACKEND_API_URL = "http://localhost:5000/api/teacher-leave-requests";

  // Sync session user attributes
  useEffect(() => {
    if (user) {
      setTeacherData({
        name: user.name || "Teacher",
        department: user.department || user.role || "Faculty",
      });
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    if (!user?.id) return;
    setIsLoadingRequests(true);
    try {
      const token = await getJwt();
      const res = await fetch(`${BACKEND_API_URL}?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const userOnlyData = data.data.filter(
          (item: LeaveRequestItem) => item.userId === user.id
        );
        setRequests(userOnlyData);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchLeaveRequests();
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Safe handler to call AI route with non-JSON 404/500 parsing guards
  const handleGenerateAI = async () => {
    if (!form.purpose.trim()) {
      alert("Please state the purpose of your leave first.");
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
          role: "teacher",
          teacherName: teacherData.name,
          department: teacherData.department,
          leaveType: form.leaveType,
          startDate: form.startDate,
          endDate: form.endDate,
          purpose: form.purpose,
        }),
      });

      if (!res.ok) {
        const errorHtmlOrText = await res.text();
        console.error("Server API returned an error:", errorHtmlOrText);
        throw new Error(
          `API endpoint returned status ${res.status}. Verify route file exists at 'app/api/leave/teacher/route.ts'`
        );
      }

      const data = await res.json();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.applicationText.trim()) {
      alert("Please generate or write an application letter before submitting.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId: user?.id,
      teacher: {
        name: teacherData.name,
        department: teacherData.department,
        email: user?.email || "",
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
        throw new Error(data.message || "Failed to submit request.");
      }

      alert("Leave Application Submitted Successfully!");

      setForm({
        leaveType: "Casual Leave",
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave request?")) return;

    setDeletingId(id);

    try {
      const token = await getJwt();
      const res = await fetch(`${BACKEND_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
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
            Please sign in with your teacher account to submit and view leave requests.
          </p>
        </div>
      </div>
    );
  }

  const filteredRequests = requests.filter((req) => req.status === activeTab);

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
        {/* LEFT COLUMN: Request Leave Form */}
        <div className="lg:col-span-7 relative bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-[2rem] shadow-xl shadow-emerald-950/5 p-6 sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="relative z-10 border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Request Leave</h1>
              <Sparkles className="w-5 h-5 fill-emerald-500 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Provide the leave details to generate your official application letter using AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Session Metadata Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Teacher
                </span>
                <span className="font-extrabold text-slate-800">{teacherData.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                  Department / Role
                </span>
                <span className="font-extrabold text-emerald-700 capitalize">
                  {teacherData.department}
                </span>
              </div>
              {user?.email && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                    Email
                  </span>
                  <span className="font-medium text-slate-700 truncate block">{user.email}</span>
                </div>
              )}
            </div>

            {/* Leave Type & Dates */}
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
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
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

            {/* Purpose & AI Prompt */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Purpose of Leave <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex flex-col sm:block">
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Suffering from severe fever and doctor advised rest"
                  required
                  className="w-full border border-slate-200 rounded-xl bg-slate-50/50 pl-4 sm:pr-44 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isAiGenerating}
                  className="mt-2 sm:mt-0 sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
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

            {/* Output Application Area */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Generated Application Preview
              </label>
              <textarea
                name="applicationText"
                value={form.applicationText}
                onChange={handleChange}
                rows={7}
                placeholder="Click 'Generate Application' above or type your letter here..."
                required
                className="w-full border border-slate-200 rounded-2xl bg-slate-50/30 p-4 text-sm font-medium leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group px-7 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
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

        {/* RIGHT COLUMN: Submitted Leave Requests List */}
        <div className="lg:col-span-5 relative bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-[2rem] shadow-xl shadow-emerald-950/5 p-6 sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-teal-200/20 blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Submitted Requests</h2>
              <p className="text-xs font-medium text-slate-500">Track and manage application statuses</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex bg-slate-100/80 p-1 rounded-full text-xs font-bold self-start xl:self-auto border border-slate-200/50">
              {(["pending", "approved", "rejected"] as const).map((tab) => {
                const count = requests.filter((r) => r.status === tab).length;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Cards List */}
          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold text-slate-600">Loading records...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/40">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-500">No {activeTab} leave requests found.</p>
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
                          {new Date(item.startDate).toLocaleDateString()} -{" "}
                          {new Date(item.endDate).toLocaleDateString()}
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

                  {/* Collapsible Application Text */}
                  <details className="mt-3 group/details border-t border-slate-100 pt-3">
                    <summary className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer list-none flex items-center gap-1 select-none">
                      <span>View Application Letter</span>
                    </summary>
                    <div className="mt-2.5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs font-mono whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {item.applicationText}
                    </div>
                  </details>

                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>Teacher: {item.teacher?.name || teacherData.name}</span>
                    <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
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






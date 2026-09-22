
"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  GraduationCap,
  Search,
  Filter,
  Loader2,
  FileText,
  Calendar,
} from "lucide-react";

interface LeaveRequest {
  _id: string;
  applicantType: "TEACHER" | "STUDENT";
  applicantName: string;
  identifier: string; // Subject for teachers, Grade/Roll No for students
  email: string;
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

export default function AdminLeaveManagementPage() {
  const [applicantType, setApplicantType] = useState<"TEACHER" | "STUDENT">("TEACHER");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const getJwt = async (): Promise<string> => { 
    const response = await fetch("/api/auth/token", { 
      credentials: "include", 
      headers: { Accept: "application/json" }, 
    }); 
    const result: JwtResponse = await response.json().catch(() => ({})); 

    if (!response.ok || !result.token) { 
      throw new Error(result.message || " You must be signed in to access this page."); 
    } 
    return result.token; 
  }; 

  // Backend Endpoints
  const TEACHER_API = `${process.env.NEXT_PUBLIC_API_URL}/api/teacher-leave-requests`;
  const STUDENT_API = `${process.env.NEXT_PUBLIC_API_URL}/api/student-leave-requests`;

  // Tab switch handler with state reset
  const handleTabChange = (type: "TEACHER" | "STUDENT") => {
    if (applicantType === type) return;
    setApplicantType(type);
    setSelectedRequest(null);
    setRequests([]);
  };

  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    const fetchRequests = async () => {
      const targetUrl = applicantType === "TEACHER" ? TEACHER_API : STUDENT_API;
      try {
        const token = await getJwt(); 
        const res = await fetch(targetUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (isSubscribed && res.ok && data.success) {
          const formatted: LeaveRequest[] = data.data.map((item: any) => ({
            _id: item._id,
            applicantType,
            applicantName:
              applicantType === "TEACHER"
                ? item.teacher?.name || item.applicantName || "N/A"
                : item.student?.name || item.applicantName || "N/A",
            identifier:
              applicantType === "TEACHER"
                ? item.teacher?.subject || item.subject || "N/A"
                : `${item.student?.grade || item.grade || "N/A"} (Roll: ${
                    item.student?.rollNumber || item.rollNumber || "N/A"
                  })`,
            email: item.teacher?.email || item.student?.email || item.email || "",
            leaveType: item.leaveType,
            startDate: item.startDate,
            endDate: item.endDate,
            purpose: item.purpose,
            applicationText: item.applicationText,
            status: item.status,
            createdAt: item.createdAt,
          }));
          setRequests(formatted);
        }
      } catch (err: any) {
        if (isSubscribed) {
          console.error("Failed to fetch leave requests:", err);
          setRequests([]);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isSubscribed = false;
    };
  }, [applicantType]);

  // Handle Approve / Reject
  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    setActionLoadingId(id);
    const targetUrl = applicantType === "TEACHER" ? `${TEACHER_API}/${id}` : `${STUDENT_API}/${id}`;

    try {
      const token = await getJwt(); 
      const res = await fetch(targetUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );
      if (selectedRequest?._id === id) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message || "Operation failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered List Computation
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesSearch =
      req.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.leaveType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const metrics = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50/80 p-4 lg:p-8 text-slate-800">
      <div className="w-full lg:w-[92%] xl:w-[88%] mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Leave Approval Portal</h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Review and manage pending leave applications for faculty members and students.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => handleTabChange("TEACHER")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                applicantType === "TEACHER"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4" /> Teachers
            </button>
            <button
              onClick={() => handleTabChange("STUDENT")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                applicantType === "STUDENT"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Students
            </button>
          </div>
        </div>

        {/* Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Approval</span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{metrics.pending}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Approved Requests</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{metrics.approved}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rejected Requests</span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">{metrics.rejected}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${applicantType.toLowerCase()}s by name or reason...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-xl bg-slate-50/50 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
              {(["pending", "approved", "rejected", "all"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    statusFilter === st
                      ? "bg-white text-emerald-700 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold">Loading applications...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">No {statusFilter} applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Type / Reason</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{req.applicantName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{req.identifier}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{req.leaveType}</span>
                        <span className="text-slate-500 truncate max-w-xs block text-[11px]">
                          {req.purpose}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{new Date(req.startDate).toLocaleDateString()}</span> -
                          <span>{new Date(req.endDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {req.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                        {req.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                        {req.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            View
                          </button>
                          {req.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req._id, "approved")}
                                disabled={actionLoadingId === req._id}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {actionLoadingId === req._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req._id, "rejected")}
                                disabled={actionLoadingId === req._id}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {actionLoadingId === req._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedRequest.applicantName}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedRequest.identifier}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-bold uppercase">Leave Type</span>
                <span className="font-extrabold text-slate-800">{selectedRequest.leaveType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-bold uppercase">Dates</span>
                <span className="font-semibold text-slate-700">
                  {selectedRequest.startDate} to {selectedRequest.endDate}
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 font-bold uppercase block mb-1">Reason</span>
                <p className="font-medium text-slate-800">{selectedRequest.purpose}</p>
              </div>
              <div className="py-1">
                <span className="text-slate-400 font-bold uppercase block mb-1">Application Letter</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-mono whitespace-pre-wrap text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  {selectedRequest.applicationText}
                </div>
              </div>
            </div>

            {selectedRequest.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(selectedRequest._id, "approved")}
                  disabled={actionLoadingId === selectedRequest._id}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex justify-center items-center gap-1"
                >
                  {actionLoadingId === selectedRequest._id && <Loader2 className="w-3 h-3 animate-spin" />}
                  Approve Application
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedRequest._id, "rejected")}
                  disabled={actionLoadingId === selectedRequest._id}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex justify-center items-center gap-1"
                >
                  {actionLoadingId === selectedRequest._id && <Loader2 className="w-3 h-3 animate-spin" />}
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}







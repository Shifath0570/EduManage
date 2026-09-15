"use client";

import React, { useState } from "react";
import { Check, X, User, GraduationCap, School } from "lucide-react";

interface RequestItem {
  id: string;
  applicantName: string;
  role: "STUDENT" | "TEACHER";
  departmentOrClass: string;
  startDate: string;
  endDate: string;
  applicationText: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const mockRequests: RequestItem[] = [
  {
    id: "1",
    applicantName: "Dr. Sarah Jenkins",
    role: "TEACHER",
    departmentOrClass: "Computer Science Dept",
    startDate: "2026-10-10",
    endDate: "2026-10-12",
    applicationText: "Respected Principal,\n\nI request approval for attending the National Tech Summit...",
    status: "PENDING",
  },
  {
    id: "2",
    applicantName: "Alex Morgan",
    role: "STUDENT",
    departmentOrClass: "Grade 11 - Sec B",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    applicationText: "To the Class Instructor,\n\nI am unable to attend classes due to viral fever...",
    status: "PENDING",
  },
];

export default function AdminLeaveView() {
  const [activeTab, setActiveTab] = useState<"TEACHER" | "STUDENT">("TEACHER");
  const [requests, setRequests] = useState<RequestItem[]>(mockRequests);

  const handleAction = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRequests = requests.filter((r) => r.role === activeTab);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Approval Hub</h1>
        <p className="text-xs text-slate-500">Manage and review incoming leave applications.</p>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("TEACHER")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            activeTab === "TEACHER"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <School className="h-4 w-4" /> Faculty Requests
        </button>
        <button
          onClick={() => setActiveTab("STUDENT")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            activeTab === "STUDENT"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Student Requests
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            No pending {activeTab.toLowerCase()} requests found.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700">
                    {req.applicantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{req.applicantName}</h3>
                    <p className="text-[11px] text-slate-500">{req.departmentOrClass}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-semibold text-slate-700">{req.startDate}</span>
                  <span className="text-slate-400"> to </span>
                  <span className="font-semibold text-slate-700">{req.endDate}</span>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 whitespace-pre-line">
                {req.applicationText}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      req.status === "APPROVED"
                        ? "text-emerald-600"
                        : req.status === "REJECTED"
                        ? "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </span>

                {req.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req.id, "REJECTED")}
                      className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "APPROVED")}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}





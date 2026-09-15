"use client";

import React, { useState } from "react";
import { Sparkles, Send, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function StudentLeaveView() {
  const [purpose, setPurpose] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedApp, setGeneratedApp] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock student history data
  const [leaveHistory] = useState([
    {
      id: "1",
      reason: "Medical Leave (Fever)",
      startDate: "2026-10-02",
      endDate: "2026-10-04",
      status: "APPROVED",
      teacherNote: "Granted. Take care.",
    },
    {
      id: "2",
      reason: "Family Function",
      startDate: "2026-09-15",
      endDate: "2026-09-16",
      status: "REJECTED",
      teacherNote: "Exams scheduled during this period.",
    },
  ]);

  const handleAIGenerate = async () => {
    if (!purpose || !startDate || !endDate) {
      alert("Please fill in dates and reason first.");
      return;
    }
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          startDate,
          endDate,
          userName: "Alex Morgan",
          userRole: "STUDENT",
        }),
      });
      const data = await res.json();
      if (data.application) setGeneratedApp(data.application);
    } catch {
      alert("Failed to draft application.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 font-sans">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Leave Portal</h1>
        <p className="text-xs text-slate-500">Submit requests to your class instructor using AI drafting.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Request Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">New Leave Request</h2>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Reason / Purpose</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Severe viral infection"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isGenerating ? "Drafting..." : "AI Assist"}
                  </button>
                </div>
              </div>

              {generatedApp && (
                <div>
                  <label className="text-xs font-semibold text-slate-700">AI Application Draft</label>
                  <textarea
                    rows={6}
                    value={generatedApp}
                    onChange={(e) => setGeneratedApp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs text-slate-800 outline-hidden focus:border-indigo-500"
                  />
                </div>
              )}

              <button
                type="button"
                disabled={!generatedApp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Submit to Class Teacher
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">My Request History</h2>
            <div className="mt-4 space-y-3">
              {leaveHistory.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.reason}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status === "APPROVED" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {item.startDate} → {item.endDate}
                  </div>
                  {item.teacherNote && (
                    <div className="mt-2 border-t border-slate-200/60 pt-2 text-[11px] italic text-slate-600">
                      Note: {item.teacherNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


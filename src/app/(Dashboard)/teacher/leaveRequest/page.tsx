
"use client";

import React, { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";

export default function TeacherLeavePage() {
    const [purpose, setPurpose] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [substituteTeacher, setSubstituteTeacher] = useState<string>("");
    const [generatedApp, setGeneratedApp] = useState<string>("");

    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 1. Call AI endpoint to generate draft
    const handleAIGenerate = async () => {
        if (!purpose || !startDate || !endDate) {
            alert("Please enter start date, end date, and leave purpose.");
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
                    userName: "Dr. Sarah Jenkins",
                    substituteTeacher,
                }),
            });

            // Verify response is actually JSON before parsing
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const htmlText = await res.text();
                console.error("Server returned HTML instead of JSON:", htmlText);
                alert(`Server error (${res.status}). Check server logs or route path.`);
                return;
            }

            const data = await res.json();
            if (res.ok && data.application) {
                setGeneratedApp(data.application);
            } else {
                alert(data.error || "Failed to generate application.");
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            alert(err?.message || "Network error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    // 2. Submit saved application to MongoDB
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!generatedApp) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/teacher/leave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "650000000000000000000001", // Replace with authenticated user ID
                    userName: "Dr. Sarah Jenkins",
                    startDate,
                    endDate,
                    purpose,
                    substituteTeacher,
                    generatedApp,
                }),
            });

            if (res.ok) {
                alert("Leave request submitted successfully for Admin review!");
                setPurpose("");
                setStartDate("");
                setEndDate("");
                setSubstituteTeacher("");
                setGeneratedApp("");
            } else {
                alert("Failed to submit leave request.");
            }
        } catch {
            alert("An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Faculty Leave Portal</h1>
                <p className="text-xs text-slate-500">
                    Enter your reason for leave to auto-generate a formal application letter using AI.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-base font-bold text-slate-900">New Application</h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Start Date</label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">End Date</label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Substitute Faculty</label>
                            <input
                                type="text"
                                placeholder="Prof. Robert Smith"
                                value={substituteTeacher}
                                onChange={(e) => setSubstituteTeacher(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-700">Leave Purpose / Reason</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                required
                                placeholder="e.g. Attending a two-day academic research conference"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={isGenerating || !purpose || !startDate || !endDate}
                                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Drafting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Generate Formal Application
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {generatedApp && (
                        <div>
                            <label className="text-xs font-semibold text-slate-700">
                                Generated Academic Application (Editable)
                            </label>
                            <textarea
                                rows={8}
                                value={generatedApp}
                                onChange={(e) => setGeneratedApp(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-xs font-mono text-slate-800 outline-hidden focus:border-indigo-500"
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !generatedApp}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Send className="h-3.5 w-3.5" />
                            )}
                            Submit to Administration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}




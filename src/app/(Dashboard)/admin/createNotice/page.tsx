"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  Calendar,
  Send,
  RotateCcw,
  Clock,
  Mail,
  Phone,
  User,
  Briefcase,
  Info,
} from "lucide-react";

// Type definitions
interface IssuedBy {
  name: string;
  designation: string;
  email: string;
  contactNumber: string;
}

interface NoticeContent {
  subject: string;
  summary: string;
  fullText: string;
}

interface NoticeFormData {
  title: string;
  issuedBy: IssuedBy;
  content: NoticeContent;
  issuedDate: string;
  effectiveDate: string;
  expiryDate: string;
  status: "draft" | "published" | "archived" | "expired";
  isActive: boolean;
}

interface Message {
  type: "success" | "error" | "info";
  text: string;
  details?: string;
}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    issuedBy: {
      name: "",
      designation: "",
      email: "",
      contactNumber: "",
    },
    content: {
      subject: "",
      summary: "",
      fullText: "",
    },
    issuedDate: new Date().toISOString().split("T")[0],
    effectiveDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "draft",
    isActive: true,
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle input changes for nested objects
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NoticeFormData] as any),
          [child]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Clear message manually
  const clearMessage = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
  };

  // Set message with auto-dismiss
  const setMessageWithTimer = (newMessage: Message) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setMessage(newMessage);

    if (progressRef.current) {
      progressRef.current.style.animation = "none";
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = "shrink 5s linear forwards";
        }
      }, 10);
    }

    const duration = newMessage.type === "success" ? 5000 : 8000;
    timerRef.current = setTimeout(() => {
      setMessage(null);
      timerRef.current = null;
    }, duration);
  };

  // AI Generation Handler (Next.js route)
  const handleGenerateNotice = async () => {
    if (!aiPrompt.trim()) {
      setMessageWithTimer({
        type: "error",
        text: "Please enter a prompt for AI generation.",
      });
      return;
    }

    setAiLoading(true);
    clearMessage();

    try {
      const response = await fetch("/api/generate-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          issuerName: formData.issuedBy.name,
          issuerDesignation: formData.issuedBy.designation,
          issuerEmail: formData.issuedBy.email,
          issuerContact: formData.issuedBy.contactNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          issuedBy: {
            name: data.issuedBy?.name || prev.issuedBy.name,
            designation:
              data.issuedBy?.designation || prev.issuedBy.designation,
            email: data.issuedBy?.email || prev.issuedBy.email,
            contactNumber:
              data.issuedBy?.contactNumber || prev.issuedBy.contactNumber,
          },
          content: {
            subject: data.content?.subject || prev.content.subject,
            summary: data.content?.summary || prev.content.summary,
            fullText: data.content?.fullText || prev.content.fullText,
          },
          issuedDate: data.issuedDate
            ? data.issuedDate.split("T")[0]
            : prev.issuedDate,
          effectiveDate: data.effectiveDate
            ? data.effectiveDate.split("T")[0]
            : prev.effectiveDate,
          expiryDate: data.expiryDate
            ? data.expiryDate.split("T")[0]
            : prev.expiryDate,
        }));

        setMessageWithTimer({
          type: "success",
          text: "Notice Generated Successfully!",
          details:
            "Form fields have been populated by AI. Review and submit when ready.",
        });
      } else {
        setMessageWithTimer({
          type: "error",
          text: `Generation failed: ${data.error || "Unknown error"}`,
        });
      }
    } catch (error: any) {
      setMessageWithTimer({
        type: "error",
        text: `Error connecting to AI route: ${error.message}`,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setMessageWithTimer({ type: "error", text: "Title is required" });
      return false;
    }
    if (formData.title.length < 3) {
      setMessageWithTimer({
        type: "error",
        text: "Title must be at least 3 characters long",
      });
      return false;
    }
    if (!formData.content.subject.trim()) {
      setMessageWithTimer({ type: "error", text: "Subject is required" });
      return false;
    }
    if (!formData.content.fullText.trim()) {
      setMessageWithTimer({
        type: "error",
        text: "Full text content is required",
      });
      return false;
    }
    if (!formData.issuedBy.name.trim()) {
      setMessageWithTimer({ type: "error", text: "Issuer name is required" });
      return false;
    }
    if (!isValidEmail(formData.issuedBy.email)) {
      setMessageWithTimer({
        type: "error",
        text: "Please enter a valid email address",
      });
      return false;
    }
    return true;
  };

  // Handle Express.js submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessageWithTimer({
          type: "success",
          text: "Notice Saved to Express Backend!",
          details: `"${data.title || formData.title}" has been saved.`,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errorData = await response.json();
        setMessageWithTimer({
          type: "error",
          text: `Failed to save notice: ${
            errorData.message || errorData.error || response.statusText
          }`,
        });
      }
    } catch (error: any) {
      setMessageWithTimer({
        type: "error",
        text: `Network Error: Unable to reach express server at http://localhost:5000. Ensure CORS is enabled on Express. (${error.message})`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    setFormData({
      title: "",
      issuedBy: {
        name: "",
        designation: "",
        email: "",
        contactNumber: "",
      },
      content: {
        subject: "",
        summary: "",
        fullText: "",
      },
      issuedDate: new Date().toISOString().split("T")[0],
      effectiveDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "draft",
      isActive: true,
    });
    setAiPrompt("");
    clearMessage();
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
              Notice Management
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Notice
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Publish official announcements, academic notices, or campus updates.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-400 bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Fields marked with <span className="text-rose-500 font-bold ml-1">*</span> are required
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Generate with Groq AI</h2>
                <p className="text-xs text-emerald-200/80">
                  Provide a brief prompt and let AI draft the notice content for you automatically.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Notice about upcoming campus maintenance on Saturday..."
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-emerald-200/50 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
              />
              <button
                type="button"
                onClick={handleGenerateNotice}
                disabled={aiLoading}
                className="bg-white text-emerald-950 font-bold px-6 py-3 rounded-2xl hover:bg-emerald-50 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg shadow-black/20 shrink-0"
              >
                {aiLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Auto-Fill Notice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`relative overflow-hidden p-5 rounded-2xl border transition-all ${
              message.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                : message.type === "error"
                ? "bg-rose-50/90 border-rose-200 text-rose-900"
                : "bg-teal-50/90 border-teal-200 text-teal-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : message.type === "error" ? (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">{message.text}</h3>
                  {message.details && (
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">
                      {message.details}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={clearMessage}
                className="p-1 rounded-lg hover:bg-black/5 transition"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>
        )}

        {/* Form Main Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Primary Notice Info */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-100 pb-5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notice Title</h2>
                <p className="text-xs text-slate-400">
                  Provide a primary title for quick identification
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Notice Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Campus Maintenance & Temporary Power Shutdown Notice"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Card 2: Issued By Information */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-100 pb-5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Issued By</h2>
                <p className="text-xs text-slate-400">
                  Contact and authority details of the notice issuer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="issuedBy.name"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Issuer Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="issuedBy.name"
                    name="issuedBy.name"
                    type="text"
                    value={formData.issuedBy.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Robert Chen"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="issuedBy.designation"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Designation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="issuedBy.designation"
                    name="issuedBy.designation"
                    type="text"
                    value={formData.issuedBy.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Dean of Academic Affairs"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="issuedBy.email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="issuedBy.email"
                    name="issuedBy.email"
                    type="email"
                    value={formData.issuedBy.email}
                    onChange={handleInputChange}
                    placeholder="e.g., r.chen@university.edu"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="issuedBy.contactNumber"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="issuedBy.contactNumber"
                    name="issuedBy.contactNumber"
                    type="tel"
                    value={formData.issuedBy.contactNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +1 (555) 019-2834"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notice Content */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-100 pb-5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notice Body</h2>
                <p className="text-xs text-slate-400">
                  Detailed subject, quick summary, and complete text body
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="content.subject"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Subject Line <span className="text-rose-500">*</span>
                </label>
                <input
                  id="content.subject"
                  name="content.subject"
                  type="text"
                  value={formData.content.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Scheduled Maintenance and Temporary Facility Closures"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="content.summary"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Short Summary <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formData.content.summary.length}/500 chars
                  </span>
                </div>
                <textarea
                  id="content.summary"
                  name="content.summary"
                  value={formData.content.summary}
                  onChange={handleInputChange}
                  rows={2}
                  maxLength={500}
                  placeholder="Provide a brief 1-2 sentence overview for push notifications or preview cards..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label
                  htmlFor="content.fullText"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Full Announcement Text <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="content.fullText"
                  name="content.fullText"
                  value={formData.content.fullText}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Write the full notice text here. Include schedules, locations, impacts, or special instructions..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Dates & Schedule */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-100 pb-5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Validity Schedule</h2>
                <p className="text-xs text-slate-400">
                  Set issue, effective start, and expiration dates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="issuedDate"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Issued Date
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="issuedDate"
                    name="issuedDate"
                    type="date"
                    value={formData.issuedDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="effectiveDate"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Effective Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="effectiveDate"
                    name="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl transition shadow-xl shadow-emerald-600/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating Notice...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Create & Publish Notice</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-4 px-8 rounded-2xl transition active:scale-98 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset Form</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
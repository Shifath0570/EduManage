"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";

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
  type: 'success' | 'error' | 'info';
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
    issuedDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NoticeFormData] as any),
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = 'shrink 5s linear forwards';
        }
      }, 10);
    }

    const duration = newMessage.type === 'success' ? 5000 : 8000;
    timerRef.current = setTimeout(() => {
      setMessage(null);
      timerRef.current = null;
    }, duration);
  };

  // AI Generation Handler (Next.js route)
  const handleGenerateNotice = async () => {
    if (!aiPrompt.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Please enter a prompt for AI generation." });
      return;
    }

    setAiLoading(true);
    clearMessage();

    try {
      const response = await fetch('/api/generate-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            designation: data.issuedBy?.designation || prev.issuedBy.designation,
            email: data.issuedBy?.email || prev.issuedBy.email,
            contactNumber: data.issuedBy?.contactNumber || prev.issuedBy.contactNumber,
          },
          content: {
            subject: data.content?.subject || prev.content.subject,
            summary: data.content?.summary || prev.content.summary,
            fullText: data.content?.fullText || prev.content.fullText,
          },
          issuedDate: data.issuedDate ? data.issuedDate.split('T')[0] : prev.issuedDate,
          effectiveDate: data.effectiveDate ? data.effectiveDate.split('T')[0] : prev.effectiveDate,
          expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : prev.expiryDate,
        }));

        setMessageWithTimer({
          type: 'success',
          text: "✨ Notice Generated Successfully!",
          details: "Form fields have been populated by AI. Review and submit when ready.",
        });
      } else {
        setMessageWithTimer({
          type: 'error',
          text: `❌ Generation failed: ${data.error || 'Unknown error'}`,
        });
      }
    } catch (error: any) {
      setMessageWithTimer({
        type: 'error',
        text: `❌ Error connecting to AI route: ${error.message}`,
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Title is required" });
      return false;
    }
    if (formData.title.length < 3) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Title must be at least 3 characters long" });
      return false;
    }
    if (!formData.content.subject.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Subject is required" });
      return false;
    }
    if (!formData.content.fullText.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Full text content is required" });
      return false;
    }
    if (!formData.issuedBy.name.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Issuer name is required" });
      return false;
    }
    if (!isValidEmail(formData.issuedBy.email)) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Please enter a valid email address" });
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
      const response = await fetch('http://localhost:5000/api/notices', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessageWithTimer({
          type: 'success',
          text: "✅ Notice Saved to Express Backend!",
          details: `"${data.title || formData.title}" has been saved.`,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        setMessageWithTimer({
          type: 'error',
          text: `❌ Failed to save notice: ${errorData.message || errorData.error || response.statusText}`,
        });
      }
    } catch (error: any) {
      setMessageWithTimer({
        type: 'error',
        text: `❌ Network Error: Unable to reach express server at http://localhost:5000. Ensure CORS is enabled on Express. (${error.message})`,
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
      issuedDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "draft",
      isActive: true,
    });
    setAiPrompt("");
    clearMessage();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Notice</h1>
        <span className="text-sm text-gray-500">Fields marked with * are required</span>
      </div>

      {/* AI Assistant Section */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h2 className="text-md font-semibold text-purple-900 mb-2">✨ Generate with Groq AI</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Notice about upcoming campus maintenance on Saturday..."
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleGenerateNotice}
            disabled={aiLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {aiLoading ? "Generating..." : "Auto-Fill Notice"}
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 border ${
          message.type === 'success' ? "bg-green-100 border-green-400 text-green-800" :
          message.type === 'error' ? "bg-red-100 border-red-400 text-red-800" :
          "bg-blue-100 border-blue-400 text-blue-800"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{message.text}</h3>
              {message.details && <p className="text-sm mt-1">{message.details}</p>}
            </div>
            <button onClick={clearMessage} className="text-sm font-bold">✕</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Notice Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter notice title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Issued By Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Issued By</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issuedBy.name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                id="issuedBy.name"
                name="issuedBy.name"
                type="text"
                value={formData.issuedBy.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.designation" className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
              <input
                id="issuedBy.designation"
                name="issuedBy.designation"
                type="text"
                value={formData.issuedBy.designation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                id="issuedBy.email"
                name="issuedBy.email"
                type="email"
                value={formData.issuedBy.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input
                id="issuedBy.contactNumber"
                name="issuedBy.contactNumber"
                type="tel"
                value={formData.issuedBy.contactNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Content</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="content.subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                id="content.subject"
                name="content.subject"
                type="text"
                value={formData.content.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="content.summary" className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
              <textarea
                id="content.summary"
                name="content.summary"
                value={formData.content.summary}
                onChange={handleInputChange}
                rows={2}
                maxLength={500}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="content.fullText" className="block text-sm font-medium text-gray-700 mb-1">Full Text *</label>
              <textarea
                id="content.fullText"
                name="content.fullText"
                value={formData.content.fullText}
                onChange={handleInputChange}
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
            <input
              id="issuedDate"
              name="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
            <input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Submit and Reset */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Notice..." : "Create Notice"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
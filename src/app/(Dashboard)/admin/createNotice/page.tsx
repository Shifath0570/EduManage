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
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set the message
    setMessage(newMessage);

    // Reset animation for progress bar
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = 'shrink 5s linear forwards';
        }
      }, 10);
    }

    // Set timer to clear message after duration
    const duration = newMessage.type === 'success' ? 5000 : 8000;
    timerRef.current = setTimeout(() => {
      setMessage(null);
      timerRef.current = null;
    }, duration);
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
    if (formData.content.subject.length < 3) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Subject must be at least 3 characters long" });
      return false;
    }
    if (!formData.content.fullText.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Full text content is required" });
      return false;
    }
    if (formData.content.fullText.length < 10) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Full text must be at least 10 characters long" });
      return false;
    }
    if (!formData.issuedBy.name.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Issuer name is required" });
      return false;
    }
    if (!formData.issuedBy.designation.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Designation is required" });
      return false;
    }
    if (!formData.issuedBy.email.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Email is required" });
      return false;
    }
    if (!isValidEmail(formData.issuedBy.email)) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Please enter a valid email address" });
      return false;
    }
    if (!formData.issuedBy.contactNumber.trim()) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Contact number is required" });
      return false;
    }
    if (!formData.effectiveDate) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Effective date is required" });
      return false;
    }
    if (!formData.expiryDate) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Expiry date is required" });
      return false;
    }
    if (new Date(formData.expiryDate) <= new Date(formData.effectiveDate)) {
      setMessageWithTimer({ type: 'error', text: "⚠️ Expiry date must be after effective date" });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear any existing messages
    clearMessage();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Use environment variable with fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${apiUrl}/api/notices`;
    
    console.log('🔵 Sending request to:', url);
    console.log('📦 Payload:', JSON.stringify({
      title: formData.title,
      issuedBy: formData.issuedBy,
      content: formData.content,
      issuedDate: new Date(formData.issuedDate).toISOString(),
      effectiveDate: new Date(formData.effectiveDate).toISOString(),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      status: formData.status,
      isActive: formData.isActive,
    }, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          issuedBy: formData.issuedBy,
          content: formData.content,
          issuedDate: new Date(formData.issuedDate).toISOString(),
          effectiveDate: new Date(formData.effectiveDate).toISOString(),
          expiryDate: new Date(formData.expiryDate).toISOString(),
          status: formData.status,
          isActive: formData.isActive,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success:', data);
        setMessageWithTimer({
          type: 'success',
          text: "✅ Notice Created Successfully!",
          details: `"${formData.title}" has been published and is now live.`,
        });
        handleReset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        let errorMessage = `Failed to create notice (Status: ${response.status})`;
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData.details || errorData.stack || '';
          console.error('❌ Error response:', errorData);
        } catch {
          try {
            const text = await response.text();
            if (text) errorMessage = text;
            console.error('❌ Error text:', text);
          } catch {
            if (response.statusText) errorMessage = response.statusText;
          }
        }
        
        setMessageWithTimer({
          type: 'error',
          text: `❌ ${errorMessage}`,
          details: errorDetails || 'Please check your input and try again.',
        });
      }
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      
      if (error.message === 'Failed to fetch') {
        setMessageWithTimer({
          type: 'error',
          text: "❌ Cannot Connect to Server",
          details: `Unable to reach ${url}. Please ensure:\n• Backend server is running on port 5000\n• No firewall is blocking the connection\n• CORS is enabled on the backend`,
        });
      } else if (error.name === 'AbortError') {
        setMessageWithTimer({
          type: 'error',
          text: "❌ Request Timed Out",
          details: "The server took too long to respond. Please try again.",
        });
      } else {
        setMessageWithTimer({
          type: 'error',
          text: `❌ Error: ${error.message}`,
          details: "An unexpected error occurred. Please try again.",
        });
      }
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
    clearMessage();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Notice</h1>
        <span className="text-sm text-gray-500">Fields marked with * are required</span>
      </div>

      {/* Enhanced Message Display - Always visible when message exists */}
      {message && (
        <div className={`relative p-4 rounded-lg mb-6 border shadow-sm ${
          message.type === 'success' 
            ? "bg-green-100 border-green-400 text-green-800 shadow-green-100"
            : message.type === 'error'
            ? "bg-red-100 border-red-400 text-red-800 shadow-red-100"
            : "bg-blue-100 border-blue-400 text-blue-800"
        }`}>
          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : message.type === 'error' ? (
                <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Message Content */}
            <div className="ml-3 flex-1">
              <h3 className={`text-base font-semibold ${
                message.type === 'success' ? "text-green-800" : 
                message.type === 'error' ? "text-red-800" : "text-blue-800"
              }`}>
                {message.text}
              </h3>
              {message.details && (
                <div className={`mt-1 text-sm ${
                  message.type === 'success' ? "text-green-700" : 
                  message.type === 'error' ? "text-red-700" : "text-blue-700"
                }`}>
                  <p className="whitespace-pre-wrap">{message.details}</p>
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs ${
                  message.type === 'success' ? "text-green-600" : 
                  message.type === 'error' ? "text-red-600" : "text-blue-600"
                }`}>
                  {message.type === 'success' ? '✓ Auto-dismissing in 5 seconds' : '⚠ Auto-dismissing in 8 seconds'}
                </span>
                {/* Progress bar */}
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    ref={progressRef}
                    className={`h-full rounded-full ${
                      message.type === 'success' ? "bg-green-500" : 
                      message.type === 'error' ? "bg-red-500" : "bg-blue-500"
                    }`} 
                    style={{ width: '100%', animation: 'shrink 5s linear forwards' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Dismiss Button */}
            <div className="ml-auto pl-3">
              <button
                onClick={clearMessage}
                className={`inline-flex rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  message.type === 'success'
                    ? "bg-green-100 text-green-600 hover:bg-green-200 focus:ring-green-500"
                    : message.type === 'error'
                    ? "bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-500"
                }`}
                aria-label="Dismiss"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State Indicator */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Creating notice... Please wait.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notice Title */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Issued By Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Issued By</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issuedBy.name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="issuedBy.name"
                name="issuedBy.name"
                type="text"
                value={formData.issuedBy.name}
                onChange={handleInputChange}
                placeholder="Full name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.designation" className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                id="issuedBy.designation"
                name="issuedBy.designation"
                type="text"
                value={formData.issuedBy.designation}
                onChange={handleInputChange}
                placeholder="e.g., Registrar, Principal"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="issuedBy.email"
                name="issuedBy.email"
                type="email"
                value={formData.issuedBy.email}
                onChange={handleInputChange}
                placeholder="email@college.edu"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="issuedBy.contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                id="issuedBy.contactNumber"
                name="issuedBy.contactNumber"
                type="tel"
                value={formData.issuedBy.contactNumber}
                onChange={handleInputChange}
                placeholder="+91-XXXXXXXXXX"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Content</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="content.subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                id="content.subject"
                name="content.subject"
                type="text"
                value={formData.content.subject}
                onChange={handleInputChange}
                placeholder="Enter subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="content.summary" className="block text-sm font-medium text-gray-700 mb-1">
                Summary *
              </label>
              <textarea
                id="content.summary"
                name="content.summary"
                value={formData.content.summary}
                onChange={handleInputChange}
                placeholder="Brief summary of the notice (max 500 characters)"
                rows={3}
                maxLength={500}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.content.summary.length}/500 characters
              </p>
            </div>
            <div>
              <label htmlFor="content.fullText" className="block text-sm font-medium text-gray-700 mb-1">
                Full Text *
              </label>
              <textarea
                id="content.fullText"
                name="content.fullText"
                value={formData.content.fullText}
                onChange={handleInputChange}
                placeholder="Enter the full notice content"
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700 mb-1">
              Issued Date
            </label>
            <input
              id="issuedDate"
              name="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date *
            </label>
            <input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date *
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status and Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Notice
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Notice...
              </span>
            ) : "Create Notice"}
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

      {/* Global CSS for animation */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Page;
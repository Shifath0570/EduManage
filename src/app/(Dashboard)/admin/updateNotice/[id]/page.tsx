"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Home, FileText, AlertCircle } from 'lucide-react';
import toast from "react-hot-toast";

interface IssuedBy {
  name: string;
  designation: string;
  email: string;
  contactNumber: string;
}

interface Content {
  subject: string;
  summary: string;
  fullText: string;
}

interface Notice {
  _id: string;
  title: string;
  issuedBy: IssuedBy;
  content: Content;
  issuedDate: string;
  effectiveDate?: string;
  expiryDate?: string;
  status: "draft" | "published" | "archived" | "expired";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface NoticeFormData {
  title: string;
  issuedBy: IssuedBy;
  content: Content;
  issuedDate: string;
  effectiveDate: string;
  expiryDate: string;
  status: "draft" | "published" | "archived" | "expired";
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Notice;
}

interface ApiError {
  message?: string;
  error?: string;
}

const UpdateNotice = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state - will be filled with API data
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
    issuedDate: "",
    effectiveDate: "",
    expiryDate: "",
    status: "draft",
    isActive: true,
  });

  // Helper: Format date for input[type="date"]
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  // Helper: Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return "Invalid date";
    }
  };

  // Fetch notice data when id is available
  useEffect(() => {
    const fetchNotice = async () => {
      // Check if id exists
      if (!id) {
        console.error("No notice ID found in params");
        setMessage({
          type: 'error',
          text: "Notice ID is required",
        });
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        setMessage(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not configured");
        }

        console.log("Fetching notice with ID:", id);
        const response = await fetch(`${apiUrl}/api/notices/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Notice not found");
          }
          throw new Error(`Failed to fetch notice (Status: ${response.status})`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          const data = result.data;

          setFormData({
            title: data.title || "",
            issuedBy: {
              name: data.issuedBy?.name || "",
              designation: data.issuedBy?.designation || "",
              email: data.issuedBy?.email || "",
              contactNumber: data.issuedBy?.contactNumber || "",
            },
            content: {
              subject: data.content?.subject || "",
              summary: data.content?.summary || "",
              fullText: data.content?.fullText || "",
            },
            issuedDate: formatDateForInput(data.issuedDate),
            effectiveDate: formatDateForInput(data.effectiveDate || data.issuedDate),
            expiryDate: formatDateForInput(data.expiryDate || data.issuedDate),
            status: data.status || "draft",
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
        } else {
          throw new Error("Invalid response format");
        }

      } catch (error: any) {
        console.error("Error fetching notice:", error);
        setMessage({
          type: 'error',
          text: error.message || "Failed to load notice data",
        });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  // Handle input changes
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

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Title is required");
    if (formData.title.length < 3) errors.push("Title must be at least 3 characters");
    if (!formData.content.subject.trim()) errors.push("Subject is required");
    if (formData.content.subject.length < 3) errors.push("Subject must be at least 3 characters");
    if (!formData.content.fullText.trim()) errors.push("Full text content is required");
    if (formData.content.fullText.length < 10) errors.push("Full text must be at least 10 characters");
    if (!formData.issuedBy.name.trim()) errors.push("Issuer name is required");
    if (!formData.issuedBy.designation.trim()) errors.push("Designation is required");
    if (!formData.issuedBy.email.trim()) errors.push("Email is required");
    if (!isValidEmail(formData.issuedBy.email)) errors.push("Please enter a valid email address");
    if (!formData.issuedBy.contactNumber.trim()) errors.push("Contact number is required");
    if (!formData.effectiveDate) errors.push("Effective date is required");
    if (!formData.expiryDate) errors.push("Expiry date is required");

    if (formData.effectiveDate && formData.expiryDate) {
      if (new Date(formData.expiryDate) <= new Date(formData.effectiveDate)) {
        errors.push("Expiry date must be after effective date");
      }
    }

    if (errors.length > 0) {
      setMessage({ type: 'error', text: errors[0] });
      return false;
    }

    return true;
  };

  // Handle form submission (UPDATE - PUT)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        title: formData.title,
        issuedBy: {
          name: formData.issuedBy.name,
          designation: formData.issuedBy.designation,
          email: formData.issuedBy.email,
          contactNumber: formData.issuedBy.contactNumber,
        },
        content: {
          subject: formData.content.subject,
          summary: formData.content.summary,
          fullText: formData.content.fullText,
        },
        issuedDate: formData.issuedDate ? new Date(formData.issuedDate).toISOString() : new Date().toISOString(),
        effectiveDate: new Date(formData.effectiveDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        status: formData.status,
        isActive: formData.isActive,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiUrl}/api/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: 'success',
          text: "Notice updated successfully!",
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });


        toast.success("Notice updated successfully!", {
          duration: 3000,
          position: "top-right",
        });
        
        setTimeout(() => {
          router.push('/notice');
        }, 2000);




      } else {
        let errorMessage = `Failed to update notice (Status: ${response.status})`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          try {
            const text = await response.text();
            if (text) errorMessage = text;
          } catch {
            if (response.statusText) errorMessage = response.statusText;
          }
        }

        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error: any) {
      console.error("Error updating notice:", error);

      if (error.name === 'AbortError') {
        setMessage({ type: 'error', text: "Request timed out. Please try again." });
      } else {
        setMessage({
          type: 'error',
          text: error.message || "An unexpected error occurred while updating the notice"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form to original API data
  const handleReset = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      const response = await fetch(`${apiUrl}/api/notices/${id}`);

      if (response.ok) {
        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          const data = result.data;

          setFormData({
            title: data.title || "",
            issuedBy: {
              name: data.issuedBy?.name || "",
              designation: data.issuedBy?.designation || "",
              email: data.issuedBy?.email || "",
              contactNumber: data.issuedBy?.contactNumber || "",
            },
            content: {
              subject: data.content?.subject || "",
              summary: data.content?.summary || "",
              fullText: data.content?.fullText || "",
            },
            issuedDate: formatDateForInput(data.issuedDate),
            effectiveDate: formatDateForInput(data.effectiveDate || data.issuedDate),
            expiryDate: formatDateForInput(data.expiryDate || data.issuedDate),
            status: data.status || "draft",
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
          setMessage(null);
        }
      }
    } catch (error) {
      console.error("Error resetting form:", error);
    }
  };

  // Handle go back
  const handleGoBack = () => {
    router.back();
  };

  // Handle go home
  const handleGoHome = () => {
    router.push('/');
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Update Notice</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notice...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Update Notice</h1>
        <span className="text-sm text-gray-500">Fields marked with * are required</span>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notice Title */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Notice Title *
            </label>
            <span className="text-xs text-gray-400">Current: {formData.title || "Not set"}</span>
          </div>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Edit the notice title above</p>
        </div>

        {/* Issued By Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Issued By</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="issuedBy.name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <span className="text-xs text-gray-400">{formData.issuedBy.name || "Not set"}</span>
              </div>
              <input
                id="issuedBy.name"
                name="issuedBy.name"
                type="text"
                value={formData.issuedBy.name}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="issuedBy.designation" className="block text-sm font-medium text-gray-700">
                  Designation *
                </label>
                <span className="text-xs text-gray-400">{formData.issuedBy.designation || "Not set"}</span>
              </div>
              <input
                id="issuedBy.designation"
                name="issuedBy.designation"
                type="text"
                value={formData.issuedBy.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="issuedBy.email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <span className="text-xs text-gray-400">{formData.issuedBy.email || "Not set"}</span>
              </div>
              <input
                id="issuedBy.email"
                name="issuedBy.email"
                type="email"
                value={formData.issuedBy.email}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="issuedBy.contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number *
                </label>
                <span className="text-xs text-gray-400">{formData.issuedBy.contactNumber || "Not set"}</span>
              </div>
              <input
                id="issuedBy.contactNumber"
                name="issuedBy.contactNumber"
                type="tel"
                value={formData.issuedBy.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Content</h2>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="content.subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <span className="text-xs text-gray-400">{formData.content.subject || "Not set"}</span>
              </div>
              <input
                id="content.subject"
                name="content.subject"
                type="text"
                value={formData.content.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="content.summary" className="block text-sm font-medium text-gray-700">
                  Summary
                </label>
                <span className="text-xs text-gray-400">{formData.content.summary.length || 0}/500 characters</span>
              </div>
              <textarea
                id="content.summary"
                name="content.summary"
                value={formData.content.summary}
                onChange={handleInputChange}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.content.summary.length}/500 characters
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="content.fullText" className="block text-sm font-medium text-gray-700">
                  Full Text *
                </label>
                <span className="text-xs text-gray-400">{formData.content.fullText.length || 0} characters</span>
              </div>
              <textarea
                id="content.fullText"
                name="content.fullText"
                value={formData.content.fullText}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
              />
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700">
                Issued Date
              </label>
              <span className="text-xs text-gray-400">
                {formData.issuedDate ? formatDateForDisplay(formData.issuedDate) : "Not set"}
              </span>
            </div>
            <input
              id="issuedDate"
              name="issuedDate"
              type="date"
              value={formData.issuedDate}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                Effective Date *
              </label>
              <span className="text-xs text-gray-400">
                {formData.effectiveDate ? formatDateForDisplay(formData.effectiveDate) : "Not set"}
              </span>
            </div>
            <input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date *
              </label>
              <span className="text-xs text-gray-400">
                {formData.expiryDate ? formatDateForDisplay(formData.expiryDate) : "Not set"}
              </span>
            </div>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Status and Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <span className={`text-xs px-2 py-0.5 rounded-full ${formData.status === 'published' ? 'bg-green-100 text-green-800' :
                formData.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  formData.status === 'archived' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {formData.status || "Not set"}
              </span>
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
                Active Notice
              </label>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
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
                Updating...
              </span>
            ) : "Update Notice"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={handleGoBack}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400 break-all">
              <span className="font-medium">API URL:</span> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
            </p>
            <p className="text-xs text-gray-400 break-all mt-1">
              <span className="font-medium">Notice ID:</span> {id || 'No ID found'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateNotice;
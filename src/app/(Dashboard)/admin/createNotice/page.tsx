// "use client";

// import { authClient } from "../../../lib/auth-client";
// import { useState, useEffect, FormEvent, ChangeEvent } from "react";

// // Type definitions
// interface IssuedBy {
//   name: string;
//   designation: string;
//   email: string;
//   contactNumber: string;
// }

// interface NoticeContent {
//   subject: string;
//   summary: string;
//   fullText: string;
// }

// interface NoticeFormData {
//   title: string;
//   issuedBy: IssuedBy;
//   content: NoticeContent;
//   issuedDate: string;
//   effectiveDate: string;
//   expiryDate: string;
//   status: "draft" | "published" | "archived" | "expired";
//   isActive: boolean;
// }

// interface ApiError {
//   message?: string;
//   error?: string;
// }

// const Page = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [tokenLoading, setTokenLoading] = useState(true);
//   const [tokenError, setTokenError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   // Form state
//   const [formData, setFormData] = useState<NoticeFormData>({
//     title: "",
//     issuedBy: {
//       name: "",
//       designation: "",
//       email: "",
//       contactNumber: "",
//     },
//     content: {
//       subject: "",
//       summary: "",
//       fullText: "",
//     },
//     issuedDate: new Date().toISOString().split('T')[0],
//     effectiveDate: new Date().toISOString().split('T')[0],
//     expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     status: "draft",
//     isActive: true,
//   });

//   // Fetch token on component mount
//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         setTokenLoading(true);
//         setTokenError(null);
        
//         const { data, error } = await authClient.token();
        
//         if (error) {
//           setTokenError(error.message || "Failed to get token");
//           setToken(null);
//         }
        
//         if (data) {
//           setToken(data.token);
//         }
//       } catch (err) {
//         console.error("Token fetch error:", err);
//         setTokenError("An unexpected error occurred while fetching token");
//         setToken(null);
//       } finally {
//         setTokenLoading(false);
//       }
//     };

//     fetchToken();
//   }, []);

//   // Handle input changes for nested objects
//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
    
//     // Handle nested fields (issuedBy.name, content.subject, etc.)
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...(prev[parent as keyof NoticeFormData] as any),
//           [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//         },
//       }));
//     } else {
//       // Handle top-level fields
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//       }));
//     }
//   };

//   // Email validation helper
//   const isValidEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   // Validate form data
//   const validateForm = (): boolean => {
//     if (!formData.title.trim()) {
//       setMessage({ type: 'error', text: "Title is required" });
//       return false;
//     }
//     if (formData.title.length < 3) {
//       setMessage({ type: 'error', text: "Title must be at least 3 characters long" });
//       return false;
//     }
//     if (!formData.content.subject.trim()) {
//       setMessage({ type: 'error', text: "Subject is required" });
//       return false;
//     }
//     if (formData.content.subject.length < 3) {
//       setMessage({ type: 'error', text: "Subject must be at least 3 characters long" });
//       return false;
//     }
//     if (!formData.content.fullText.trim()) {
//       setMessage({ type: 'error', text: "Full text content is required" });
//       return false;
//     }
//     if (formData.content.fullText.length < 10) {
//       setMessage({ type: 'error', text: "Full text must be at least 10 characters long" });
//       return false;
//     }
//     if (!formData.issuedBy.name.trim()) {
//       setMessage({ type: 'error', text: "Issuer name is required" });
//       return false;
//     }
//     if (!formData.issuedBy.designation.trim()) {
//       setMessage({ type: 'error', text: "Designation is required" });
//       return false;
//     }
//     if (!formData.issuedBy.email.trim()) {
//       setMessage({ type: 'error', text: "Email is required" });
//       return false;
//     }
//     if (!isValidEmail(formData.issuedBy.email)) {
//       setMessage({ type: 'error', text: "Please enter a valid email address" });
//       return false;
//     }
//     if (!formData.issuedBy.contactNumber.trim()) {
//       setMessage({ type: 'error', text: "Contact number is required" });
//       return false;
//     }
//     if (!formData.effectiveDate) {
//       setMessage({ type: 'error', text: "Effective date is required" });
//       return false;
//     }
//     if (!formData.expiryDate) {
//       setMessage({ type: 'error', text: "Expiry date is required" });
//       return false;
//     }
//     // Check if expiry date is after effective date
//     if (new Date(formData.expiryDate) <= new Date(formData.effectiveDate)) {
//       setMessage({ type: 'error', text: "Expiry date must be after effective date" });
//       return false;
//     }
//     return true;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!token) {
//       setMessage({
//         type: 'error',
//         text: "Authentication token not available. Please try again.",
//       });
//       return;
//     }

//     // Validate form
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       // Convert dates to ISO string
//       const payload = {
//         title: formData.title,
//         issuedBy: {
//           name: formData.issuedBy.name,
//           designation: formData.issuedBy.designation,
//           email: formData.issuedBy.email,
//           contactNumber: formData.issuedBy.contactNumber,
//         },
//         content: {
//           subject: formData.content.subject,
//           summary: formData.content.summary,
//           fullText: formData.content.fullText,
//         },
//         issuedDate: new Date(formData.issuedDate).toISOString(),
//         effectiveDate: new Date(formData.effectiveDate).toISOString(),
//         expiryDate: new Date(formData.expiryDate).toISOString(),
//         status: formData.status,
//         isActive: formData.isActive,
//       };

//       // Check if API URL is configured
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//       if (!apiUrl) {
//         throw new Error("API URL is not configured");
//       }

//       // Create abort controller for timeout
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000);

//       const response = await fetch(`${apiUrl}/api/notices`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (response.ok) {
//         const data = await response.json();
//         setMessage({
//           type: 'success',
//           text: "Notice created successfully!",
//         });
        
//         // Reset form
//         setFormData({
//           title: "",
//           issuedBy: {
//             name: "",
//             designation: "",
//             email: "",
//             contactNumber: "",
//           },
//           content: {
//             subject: "",
//             summary: "",
//             fullText: "",
//           },
//           issuedDate: new Date().toISOString().split('T')[0],
//           effectiveDate: new Date().toISOString().split('T')[0],
//           expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//           status: "draft",
//           isActive: true,
//         });

//         // Scroll to top to show success message
//         window.scrollTo({ top: 0, behavior: 'smooth' });
        
//       } else {
//         // Handle error response
//         let errorMessage = `Failed to create notice (Status: ${response.status})`;
//         try {
//           const errorData: ApiError = await response.json();
//           errorMessage = errorData.message || errorData.error || errorMessage;
//         } catch {
//           try {
//             const text = await response.text();
//             if (text) errorMessage = text;
//           } catch {
//             if (response.statusText) errorMessage = response.statusText;
//           }
//         }
        
//         setMessage({
//           type: 'error',
//           text: errorMessage,
//         });
//       }
//     } catch (error: any) {
//       console.error("Error creating notice:", error);
      
//       // Handle specific error types
//       if (error.name === 'AbortError') {
//         setMessage({
//           type: 'error',
//           text: "Request timed out. Please try again.",
//         });
//       } else if (error.message) {
//         setMessage({
//           type: 'error',
//           text: error.message,
//         });
//       } else {
//         setMessage({
//           type: 'error',
//           text: "An unexpected error occurred while creating the notice",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form handler
//   const handleReset = () => {
//     setFormData({
//       title: "",
//       issuedBy: {
//         name: "",
//         designation: "",
//         email: "",
//         contactNumber: "",
//       },
//       content: {
//         subject: "",
//         summary: "",
//         fullText: "",
//       },
//       issuedDate: new Date().toISOString().split('T')[0],
//       effectiveDate: new Date().toISOString().split('T')[0],
//       expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       status: "draft",
//       isActive: true,
//     });
//     setMessage(null);
//   };

//   // Loading state
//   if (tokenLoading) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
//         <div className="flex items-center justify-center p-8">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading session...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (tokenError) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
//         <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
//           <h3 className="font-semibold mb-2">Authentication Error</h3>
//           <p>{tokenError}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated
//   if (!token) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
//           <h3 className="font-semibold mb-2">Authentication Required</h3>
//           <p>Please log in to create a notice.</p>
//           <a
//             href="/login"
//             className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
//           >
//             Log In
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Create New Notice</h1>
//         <span className="text-sm text-gray-500">Fields marked with * are required</span>
//       </div>

//       {/* Message display */}
//       {message && (
//         <div className={`p-4 rounded-lg mb-6 ${
//           message.type === 'success' 
//             ? "bg-green-50 border border-green-200 text-green-800"
//             : "bg-red-50 border border-red-200 text-red-800"
//         }`}>
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Notice Title */}
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//             Notice Title *
//           </label>
//           <input
//             id="title"
//             name="title"
//             type="text"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Enter notice title"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         {/* Issued By Section */}
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">Issued By</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="issuedBy.name" className="block text-sm font-medium text-gray-700 mb-1">
//                 Name *
//               </label>
//               <input
//                 id="issuedBy.name"
//                 name="issuedBy.name"
//                 type="text"
//                 value={formData.issuedBy.name}
//                 onChange={handleInputChange}
//                 placeholder="Full name"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label htmlFor="issuedBy.designation" className="block text-sm font-medium text-gray-700 mb-1">
//                 Designation *
//               </label>
//               <input
//                 id="issuedBy.designation"
//                 name="issuedBy.designation"
//                 type="text"
//                 value={formData.issuedBy.designation}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Registrar, Principal"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label htmlFor="issuedBy.email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email *
//               </label>
//               <input
//                 id="issuedBy.email"
//                 name="issuedBy.email"
//                 type="email"
//                 value={formData.issuedBy.email}
//                 onChange={handleInputChange}
//                 placeholder="email@college.edu"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label htmlFor="issuedBy.contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                 Contact Number *
//               </label>
//               <input
//                 id="issuedBy.contactNumber"
//                 name="issuedBy.contactNumber"
//                 type="tel"
//                 value={formData.issuedBy.contactNumber}
//                 onChange={handleInputChange}
//                 placeholder="+91-XXXXXXXXXX"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4 text-gray-700">Content</h2>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="content.subject" className="block text-sm font-medium text-gray-700 mb-1">
//                 Subject *
//               </label>
//               <input
//                 id="content.subject"
//                 name="content.subject"
//                 type="text"
//                 value={formData.content.subject}
//                 onChange={handleInputChange}
//                 placeholder="Enter subject"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label htmlFor="content.summary" className="block text-sm font-medium text-gray-700 mb-1">
//                 Summary *
//               </label>
//               <textarea
//                 id="content.summary"
//                 name="content.summary"
//                 value={formData.content.summary}
//                 onChange={handleInputChange}
//                 placeholder="Brief summary of the notice (max 500 characters)"
//                 rows={3}
//                 maxLength={500}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//               />
//               <p className="text-xs text-gray-400 mt-1">
//                 {formData.content.summary.length}/500 characters
//               </p>
//             </div>
//             <div>
//               <label htmlFor="content.fullText" className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Text *
//               </label>
//               <textarea
//                 id="content.fullText"
//                 name="content.fullText"
//                 value={formData.content.fullText}
//                 onChange={handleInputChange}
//                 placeholder="Enter the full notice content"
//                 rows={6}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Date Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Issued Date
//             </label>
//             <input
//               id="issuedDate"
//               name="issuedDate"
//               type="date"
//               value={formData.issuedDate}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Effective Date *
//             </label>
//             <input
//               id="effectiveDate"
//               name="effectiveDate"
//               type="date"
//               value={formData.effectiveDate}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Expiry Date *
//             </label>
//             <input
//               id="expiryDate"
//               name="expiryDate"
//               type="date"
//               value={formData.expiryDate}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Status and Active */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//               <option value="archived">Archived</option>
//               <option value="expired">Expired</option>
//             </select>
//           </div>
//           <div className="flex items-center pt-6">
//             <input
//               id="isActive"
//               name="isActive"
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={handleInputChange}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
//               Active Notice
//             </label>
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Creating...
//               </span>
//             ) : "Create Notice"}
//           </button>
//           <button
//             type="button"
//             onClick={handleReset}
//             className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
//           >
//             Reset Form
//           </button>
//         </div>

//         {/* Development info */}
//         {process.env.NODE_ENV === 'development' && token && (
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <p className="text-xs text-gray-400 break-all">
//               <span className="font-medium">API URL:</span> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
//             </p>
//             <p className="text-xs text-gray-400 break-all mt-1">
//               <span className="font-medium">Token:</span> {token.substring(0, 30)}...
//             </p>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Page;


"use client";

import { authClient } from "../../../lib/auth-client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

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

interface ApiError {
  message?: string;
  error?: string;
}

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  // Fetch token/session on component mount
  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        setTokenLoading(true);
        setTokenError(null);
        
        // Use getSession() instead of non-existent token() method
        const sessionResponse = await authClient.getSession();
        
        if (sessionResponse?.error) {
          setTokenError(sessionResponse.error.message || "Failed to retrieve session");
          setToken(null);
        } else if (sessionResponse?.data) {
          // Extract token or session identifier from returned data
          const sessionData = sessionResponse.data as any;
          const sessionToken = sessionData.token || sessionData.session?.token || sessionData.session?.id;
          
          if (sessionToken) {
            setToken(sessionToken);
          } else {
            // If server uses HTTP-only cookies, set placeholder so form renders
            setToken("cookie-session-active");
          }
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error("Token fetch error:", err);
        setTokenError("An unexpected error occurred while fetching authentication details");
        setToken(null);
      } finally {
        setTokenLoading(false);
      }
    };

    fetchSessionToken();
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

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: "Title is required" });
      return false;
    }
    if (formData.title.length < 3) {
      setMessage({ type: 'error', text: "Title must be at least 3 characters long" });
      return false;
    }
    if (!formData.content.subject.trim()) {
      setMessage({ type: 'error', text: "Subject is required" });
      return false;
    }
    if (formData.content.subject.length < 3) {
      setMessage({ type: 'error', text: "Subject must be at least 3 characters long" });
      return false;
    }
    if (!formData.content.fullText.trim()) {
      setMessage({ type: 'error', text: "Full text content is required" });
      return false;
    }
    if (formData.content.fullText.length < 10) {
      setMessage({ type: 'error', text: "Full text must be at least 10 characters long" });
      return false;
    }
    if (!formData.issuedBy.name.trim()) {
      setMessage({ type: 'error', text: "Issuer name is required" });
      return false;
    }
    if (!formData.issuedBy.designation.trim()) {
      setMessage({ type: 'error', text: "Designation is required" });
      return false;
    }
    if (!formData.issuedBy.email.trim()) {
      setMessage({ type: 'error', text: "Email is required" });
      return false;
    }
    if (!isValidEmail(formData.issuedBy.email)) {
      setMessage({ type: 'error', text: "Please enter a valid email address" });
      return false;
    }
    if (!formData.issuedBy.contactNumber.trim()) {
      setMessage({ type: 'error', text: "Contact number is required" });
      return false;
    }
    if (!formData.effectiveDate) {
      setMessage({ type: 'error', text: "Effective date is required" });
      return false;
    }
    if (!formData.expiryDate) {
      setMessage({ type: 'error', text: "Expiry date is required" });
      return false;
    }
    if (new Date(formData.expiryDate) <= new Date(formData.effectiveDate)) {
      setMessage({ type: 'error', text: "Expiry date must be after effective date" });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({
        type: 'error',
        text: "Authentication session not available. Please try again.",
      });
      return;
    }

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
        issuedDate: new Date(formData.issuedDate).toISOString(),
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

      const response = await fetch(`${apiUrl}api/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setMessage({
          type: 'success',
          text: "Notice created successfully!",
        });
        
        handleReset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        let errorMessage = `Failed to create notice (Status: ${response.status})`;
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
        
        setMessage({
          type: 'error',
          text: errorMessage,
        });
      }
    } catch (error: any) {
      console.error("Error creating notice:", error);
      
      if (error.name === 'AbortError') {
        setMessage({
          type: 'error',
          text: "Request timed out. Please try again.",
        });
      } else if (error.message) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'error',
          text: "An unexpected error occurred while creating the notice",
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
    setMessage(null);
  };

  // Loading state
  if (tokenLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (tokenError) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Authentication Error</h3>
          <p>{tokenError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create Notice</h1>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Authentication Required</h3>
          <p>Please log in to create a notice.</p>
          <a
            href="/login"
            className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Notice</h1>
        <span className="text-sm text-gray-500">Fields marked with * are required</span>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {message.text}
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
                Creating...
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

        {process.env.NODE_ENV === 'development' && token && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400 break-all">
              <span className="font-medium">API URL:</span> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
            </p>
            <p className="text-xs text-gray-400 break-all mt-1">
              <span className="font-medium">Token/Session:</span> {token.substring(0, 30)}...
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Page;



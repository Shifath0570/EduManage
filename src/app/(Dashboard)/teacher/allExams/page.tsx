"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button, Spinner } from "@heroui/react";
import {
  Award,
  Plus,
  Search,
  RotateCcw,
  Calendar,
  Layers,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  PencilLine,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  UserCheck,
  ShieldAlert,
  Loader2,
  Clock,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Lock
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "@/app/lib/auth-client";

interface QuestionConfigItem {
  count: number;
  marksPerQuestion: number;
}

interface QuestionConfiguration {
  mcq: QuestionConfigItem;
  short: QuestionConfigItem;
  creative: QuestionConfigItem;
}

interface ExamItem {
  _id: string;
  examName: string;
  examType: string;
  className: string;
  stream?: string;
  section?: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  duration?: string;
  status: "Active" | "Upcoming" | "Completed" | string;
  description?: string;
  createdBy?: string;
  createdByEmail?: string;
  createdByName?: string;
  createdByRole?: string;
  questionConfiguration?: QuestionConfiguration;
  createdAt?: string;
}

const classFilterOptions = [
  "All Classes", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
];

const statusFilterOptions = ["All Statuses", "Active", "Upcoming", "Completed"];

export default function TeacherAllExams() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Tab Partition: "all" | "mine"
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");

  // Selected Exam for View Modal
  const [viewExam, setViewExam] = useState<ExamItem | null>(null);

  // Selected Exam for Edit Modal
  const [editExam, setEditExam] = useState<ExamItem | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Selected Exam for HeroUI AlertDialog Delete Confirmation
  const [deleteExamTarget, setDeleteExamTarget] = useState<ExamItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Helper to check if current logged-in teacher is the owner of an exam
  const isOwner = (exam: ExamItem): boolean => {
    if (!user) return false;
    if (exam.createdByEmail && user.email && exam.createdByEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    if (exam.createdBy && user.id && String(exam.createdBy) === String(user.id)) {
      return true;
    }
    return false;
  };

  // Fetch Exams from API
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/exams`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setExams(data.data);
      } else {
        throw new Error(data.message || "Failed to load exams list.");
      }
    } catch (err) {
      console.error("Fetch exams error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [API_BASE]);

  // Handle Confirmed Exam Deletion (Owner only)
  const handleConfirmDelete = async () => {
    if (!deleteExamTarget) return;

    setIsDeleting(true);
    setDeleteError(null);
    setActionFeedback(null);

    const id = deleteExamTarget._id;
    const examName = deleteExamTarget.examName;

    try {
      const res = await fetch(`${API_BASE}/api/exams/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
          "x-user-role": "teacher"
        },
        body: JSON.stringify({
          teacherEmail: user?.email,
          teacherRole: "teacher"
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete exam. You may only delete exams you created.");
      }

      toast.success(`Exam "${examName}" deleted successfully!`);
      setActionFeedback({
        type: "success",
        message: `Exam "${examName}" deleted successfully.`
      });

      // Update local state
      setExams((prev) => prev.filter((item) => item._id !== id));
      if (viewExam?._id === id) setViewExam(null);
      if (editExam?._id === id) setEditExam(null);
      setDeleteExamTarget(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete exam.";
      toast.error(errorMsg);
      setDeleteError(errorMsg);
      setActionFeedback({
        type: "error",
        message: errorMsg
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Edit Exam Submit (Owner only)
  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExam) return;

    if (editExam.passMarks > editExam.totalMarks) {
      setEditError("Pass marks cannot be greater than total marks.");
      return;
    }

    setIsUpdating(true);
    setEditError(null);

    try {
      const res = await fetch(`${API_BASE}/api/exams/${editExam._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || "",
          "x-user-role": "teacher"
        },
        body: JSON.stringify({
          examName: editExam.examName,
          examType: editExam.examType,
          totalMarks: Number(editExam.totalMarks),
          passMarks: Number(editExam.passMarks),
          examDate: editExam.examDate,
          duration: editExam.duration,
          status: editExam.status,
          description: editExam.description,
          questionConfiguration: editExam.questionConfiguration,
          teacherEmail: user?.email,
          teacherRole: "teacher"
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update exam.");
      }

      toast.success(`Exam "${editExam.examName}" updated successfully!`);
      setActionFeedback({
        type: "success",
        message: `Exam "${editExam.examName}" updated successfully.`
      });

      // Update in state
      setExams((prev) =>
        prev.map((item) => (item._id === editExam._id ? { ...item, ...data.data } : item))
      );
      setEditExam(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update exam.";
      setEditError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedClass("All Classes");
    setSelectedStatus("All Statuses");
    setCurrentPage(1);
  };

  // Count my created exams
  const myExamsCount = useMemo(() => {
    return exams.filter(isOwner).length;
  }, [exams, user]);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Partition filter
      if (activeTab === "mine" && !isOwner(exam)) {
        return false;
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        exam.examName.toLowerCase().includes(query) ||
        exam.className.toLowerCase().includes(query) ||
        (exam.subject && exam.subject.toLowerCase().includes(query)) ||
        (exam.examType && exam.examType.toLowerCase().includes(query)) ||
        (exam.createdByName && exam.createdByName.toLowerCase().includes(query));

      // Class match
      const matchesClass =
        selectedClass === "All Classes" ||
        exam.className.toLowerCase().replace("class_", "").replace("class", "").trim() ===
          selectedClass.toLowerCase().replace("class_", "").replace("class", "").trim();

      // Status match
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        exam.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesQuery && matchesClass && matchesStatus;
    });
  }, [exams, searchQuery, selectedClass, selectedStatus, activeTab, user]);

  // Pagination bounds
  const totalExams = filteredExams.length;
  const totalPages = Math.ceil(totalExams / itemsPerPage) || 1;

  const currentExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  const startItemIndex = totalExams === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalExams);

  const getStatusBadge = (status: string) => {
    const s = (status || "Active").toLowerCase();
    if (s === "active") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "upcoming") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (s === "completed") {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Award className="h-4 w-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Exam Schedule & Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            View all school examinations and manage your created exam papers, blueprints, and marks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/teacher/createExam")}
          className="bg-[#03204C] hover:bg-[#1556a7] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 transition cursor-pointer"
        >
          <Plus size={16} /> Create Exam
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
            actionFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {actionFeedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* 2-Partition Tabs: All Exams vs My Exams */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#03204c] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/70"
          }`}
        >
          <Layers size={16} />
          <span>All School Exams</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {exams.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("mine");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "mine"
              ? "bg-[#03204c] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200/70"
          }`}
        >
          <UserCheck size={16} />
          <span>My Created Exams</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "mine" ? "bg-blue-300 text-blue-950" : "bg-blue-100 text-blue-800"
            }`}
          >
            {myExamsCount}
          </span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-slate-100 bg-slate-50/40">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by exam name, class, subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              {classFilterOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              {statusFilterOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Exam Name</th>
                <th className="py-3.5 px-4">Exam Type</th>
                <th className="py-3.5 px-4">Class & Stream</th>
                <th className="py-3.5 px-4">Subject Scope</th>
                <th className="py-3.5 px-4">Exam Date</th>
                <th className="py-3.5 px-4 text-center">Total / Pass</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Created By</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner size="md" color="accent" />
                      <span>Loading examination records...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-rose-500">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-rose-400" />
                    {error}
                  </td>
                </tr>
              ) : currentExams.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    {activeTab === "mine"
                      ? "You haven't created any exams yet. Click 'Create Exam' to schedule your first exam."
                      : "No examinations found matching your filter criteria."}
                  </td>
                </tr>
              ) : (
                currentExams.map((exam, idx) => {
                  const overallIndex = (currentPage - 1) * itemsPerPage + idx;
                  const teacherIsOwner = isOwner(exam);

                  return (
                    <tr key={exam._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {overallIndex + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{exam.examName}</div>
                        {exam.description && (
                          <div className="text-xs text-slate-400 truncate max-w-[220px]">
                            {exam.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {exam.examType || "Mid Term"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {exam.className}
                          {exam.section ? ` (Sec ${exam.section})` : ""}
                        </div>
                        {exam.stream && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 mt-0.5">
                            {exam.stream}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {exam.subject || "All Subjects"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{exam.examDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {exam.totalMarks || 100} /{" "}
                        <span className="text-emerald-600">{exam.passMarks || 40}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            exam.status
                          )}`}
                        >
                          {exam.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {teacherIsOwner ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <UserCheck size={12} /> You
                          </span>
                        ) : exam.createdByRole === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {exam.createdByName || exam.createdByRole || "Faculty"}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* AI Question Paper */}
                          <button
                            title="AI Question Paper"
                            onClick={() => router.push(`/teacher/questionPaper/${exam._id}`)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 transition cursor-pointer"
                          >
                            <Sparkles size={15} />
                          </button>

                          {/* View Details */}
                          <button
                            title="View Details"
                            onClick={() => setViewExam(exam)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Exam (Owner only) */}
                          {teacherIsOwner ? (
                            <button
                              title="Edit Exam (Your Exam)"
                              onClick={() => {
                                setEditExam({ ...exam });
                                setEditError(null);
                              }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition cursor-pointer"
                            >
                              <PencilLine size={15} />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="You can only edit exams you created"
                              className="p-1.5 text-slate-300 bg-slate-50 rounded-lg border border-slate-200 cursor-not-allowed"
                            >
                              <Lock size={15} />
                            </button>
                          )}

                          {/* Delete Exam (Owner only) */}
                          {teacherIsOwner ? (
                            <button
                              title="Delete Exam (Your Exam)"
                              onClick={() => {
                                setDeleteExamTarget(exam);
                                setDeleteError(null);
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 transition cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="You can only delete exams you created"
                              className="p-1.5 text-slate-300 bg-slate-50 rounded-lg border border-slate-200 cursor-not-allowed"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-t border-slate-100 text-xs text-slate-500 bg-slate-50/40">
          <div className="flex items-center gap-4">
            <div>
              Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalExams}</span> exams
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="px-3 py-1.5 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Exam Details Modal */}
      {viewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Award className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Exam Details</h3>
              </div>
              <button
                onClick={() => setViewExam(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Exam Name</span>
                  <p className="font-bold text-slate-800">{viewExam.examName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Target Class & Section</span>
                  <p className="font-bold text-slate-800">
                    {viewExam.className}
                    {viewExam.section ? ` (Section ${viewExam.section})` : ""}
                    {viewExam.stream ? ` - ${viewExam.stream}` : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Exam Type</span>
                  <p className="font-semibold text-slate-700">{viewExam.examType || "Mid Term"}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Subject Scope</span>
                  <p className="font-semibold text-slate-700">{viewExam.subject || "All Subjects"}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Exam Start Date</span>
                  <p className="font-semibold text-slate-700">{viewExam.examDate}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Duration</span>
                  <p className="font-semibold text-slate-700">{viewExam.duration || "2 Hours 30 Minutes"}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Marks Configuration</span>
                  <p className="font-semibold text-slate-700">
                    Total: {viewExam.totalMarks || 100} | Pass: {viewExam.passMarks || 40}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Created By</span>
                  <p className="font-semibold text-slate-700">
                    {viewExam.createdByName || viewExam.createdByEmail || viewExam.createdByRole || "System"}
                  </p>
                </div>
              </div>

              {/* Question Configuration Blueprint Summary */}
              {viewExam.questionConfiguration && (
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-2">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-600" /> Question Paper Blueprint
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs text-purple-950">
                    <div className="bg-white/80 p-2 rounded-lg border border-purple-100">
                      <div className="font-bold">MCQ</div>
                      <div>{viewExam.questionConfiguration.mcq?.count || 0} Qs × {viewExam.questionConfiguration.mcq?.marksPerQuestion || 1}M</div>
                      <div className="font-semibold text-purple-700">
                        = {(viewExam.questionConfiguration.mcq?.count || 0) * (viewExam.questionConfiguration.mcq?.marksPerQuestion || 1)} Marks
                      </div>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-purple-100">
                      <div className="font-bold">Short</div>
                      <div>{viewExam.questionConfiguration.short?.count || 0} Qs × {viewExam.questionConfiguration.short?.marksPerQuestion || 2}M</div>
                      <div className="font-semibold text-purple-700">
                        = {(viewExam.questionConfiguration.short?.count || 0) * (viewExam.questionConfiguration.short?.marksPerQuestion || 2)} Marks
                      </div>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-purple-100">
                      <div className="font-bold">Creative</div>
                      <div>{viewExam.questionConfiguration.creative?.count || 0} Qs × {viewExam.questionConfiguration.creative?.marksPerQuestion || 5}M</div>
                      <div className="font-semibold text-purple-700">
                        = {(viewExam.questionConfiguration.creative?.count || 0) * (viewExam.questionConfiguration.creative?.marksPerQuestion || 5)} Marks
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewExam.description && (
                <div>
                  <span className="text-xs text-slate-400 font-medium">Description / Rules</span>
                  <p className="mt-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    {viewExam.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const id = viewExam._id;
                  setViewExam(null);
                  router.push(`/teacher/questionPaper/${id}`);
                }}
                className="bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-300" /> AI Question Paper
              </button>
              <button
                onClick={() => {
                  const id = viewExam._id;
                  setViewExam(null);
                  router.push(`/teacher/enterMarks?examId=${id}`);
                }}
                className="bg-[#03204C] hover:bg-[#1556a7] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileSpreadsheet size={14} /> Enter Marks
              </button>
              <button
                onClick={() => setViewExam(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal (Owner only) */}
      {editExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <PencilLine className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Edit Exam Schedule</h3>
              </div>
              <button
                onClick={() => setEditExam(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateExam} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Title / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editExam.examName}
                    onChange={(e) => setEditExam({ ...editExam, examName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={editExam.examType}
                    onChange={(e) => setEditExam({ ...editExam, examType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final">Final Examination</option>
                    <option value="Class Test">Class Test</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editExam.examDate}
                    onChange={(e) => setEditExam({ ...editExam, examDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    required
                    value={editExam.totalMarks}
                    onChange={(e) => setEditExam({ ...editExam, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pass Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={editExam.totalMarks}
                    required
                    value={editExam.passMarks}
                    onChange={(e) => setEditExam({ ...editExam, passMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editExam.duration || ""}
                    onChange={(e) => setEditExam({ ...editExam, duration: e.target.value })}
                    placeholder="e.g. 2 Hours 30 Minutes"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editExam.status}
                    onChange={(e) => setEditExam({ ...editExam, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={editExam.description || ""}
                    onChange={(e) => setEditExam({ ...editExam, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditExam(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#03204C] hover:bg-[#1556a7] text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HeroUI Alert Dialog for Delete Confirmation (Owner only) */}
      <AlertDialog
        isOpen={Boolean(deleteExamTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteExamTarget(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading className="text-lg font-bold text-slate-900">
                  Delete Exam Schedule?
                </AlertDialog.Heading>
              </AlertDialog.Header>

              <AlertDialog.Body className="space-y-3 pt-2">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="font-semibold text-slate-900">
                    &quot;{deleteExamTarget?.examName}&quot;
                  </strong>{" "}
                  for{" "}
                  <span className="font-medium text-slate-800">
                    {deleteExamTarget?.className}
                    {deleteExamTarget?.section ? ` (Section ${deleteExamTarget.section})` : ""}
                  </span>
                  ? This will permanently remove the exam record. This action cannot be undone.
                </p>

                {deleteError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    {deleteError}
                  </div>
                )}
              </AlertDialog.Body>

              <AlertDialog.Footer className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  slot="close"
                  variant="tertiary"
                  isDisabled={isDeleting}
                  onClick={() => {
                    setDeleteExamTarget(null);
                    setDeleteError(null);
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isDisabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Exam
                    </>
                  )}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}

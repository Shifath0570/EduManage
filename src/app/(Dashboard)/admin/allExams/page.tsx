"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";
import {
  Award,
  Plus,
  Search,
  Filter,
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
  Clock,
  BookOpen,
  Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface ExamItem {
  _id: string;
  examName: string;
  examType: string;
  className: string;
  section?: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  status: "Active" | "Upcoming" | "Completed" | string;
  description?: string;
  createdAt?: string;
}

const classFilterOptions = [
  "All Classes", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"
];

const statusFilterOptions = ["All Statuses", "Active", "Upcoming", "Completed"];

export default function AllExamList() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");

  // Selected Exam for View Modal
  const [viewExam, setViewExam] = useState<ExamItem | null>(null);

  // Selected Exam for HeroUI AlertDialog Delete Confirmation
  const [deleteExamTarget, setDeleteExamTarget] = useState<ExamItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  // Open HeroUI Alert Dialog for Exam Deletion
  const handleOpenDeleteDialog = (exam: ExamItem) => {
    setDeleteExamTarget(exam);
    setDeleteError(null);
  };

  // Handle Confirmed Exam Deletion
  const handleConfirmDelete = async () => {
    if (!deleteExamTarget) return;

    setIsDeleting(true);
    setDeleteError(null);
    setActionFeedback(null);

    const id = deleteExamTarget._id;
    const examName = deleteExamTarget.examName;

    try {
      const res = await fetch(`${API_BASE}/api/exams/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete exam.");
      }

      toast.success(`Exam "${examName}" deleted successfully!`);

      setActionFeedback({
        type: "success",
        message: `Exam "${examName}" deleted successfully.`
      });

      // Update local state instantly
      setExams((prev) => prev.filter((item) => item._id !== id));
      if (viewExam?._id === id) setViewExam(null);
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

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedClass("All Classes");
    setSelectedStatus("All Statuses");
    setCurrentPage(1);
  };

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        exam.examName.toLowerCase().includes(query) ||
        exam.className.toLowerCase().includes(query) ||
        (exam.subject && exam.subject.toLowerCase().includes(query)) ||
        (exam.examType && exam.examType.toLowerCase().includes(query));

      // Class match
      const matchesClass =
        selectedClass === "All Classes" ||
        exam.className.toLowerCase().replace('class_', '').replace('class', '').trim() ===
        selectedClass.toLowerCase().replace('class_', '').replace('class', '').trim();

      // Status match
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        exam.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesQuery && matchesClass && matchesStatus;
    });
  }, [exams, searchQuery, selectedClass, selectedStatus]);

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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Award className="h-4 w-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              All Exam List
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Overview of all scheduled and created examinations across all classes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/createExam")}
          className="bg-[#03204C]/80 hover:bg-[#1556a7] text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition"
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
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
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
              className="bg-white border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-indigo-500"
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
              className="bg-white border border-slate-200 text-sm rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-indigo-500"
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
              className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-slate-100 transition"
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
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Subject Scope</th>
                <th className="py-3.5 px-4">Exam Date</th>
                <th className="py-3.5 px-4 text-center">Total / Pass</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    Loading examination records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-rose-500">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-rose-400" />
                    {error}
                  </td>
                </tr>
              ) : currentExams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No exams found. Click "Create Exam" to schedule a new examination.
                  </td>
                </tr>
              ) : (
                currentExams.map((exam, idx) => {
                  const overallIndex = (currentPage - 1) * itemsPerPage + idx;
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
                        <span className="font-semibold text-slate-800">
                          {exam.className}{exam.section ? ` (Sec ${exam.section})` : ""}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {exam.subject || "All Subjects"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{exam.examDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {exam.totalMarks || 100} / <span className="text-emerald-600">{exam.passMarks || 40}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(exam.status)}`}>
                          {exam.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="View Details"
                            onClick={() => setViewExam(exam)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            title="Enter Marks"
                            onClick={() => router.push("/admin/enterMarks")}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-100 transition"
                          >
                            <PencilLine size={15} />
                          </button>
                          <button
                            title="Delete Exam"
                            onClick={() => handleOpenDeleteDialog(exam)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 transition"
                          >
                            <Trash2 size={15} />
                          </button>
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
                className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="px-3 py-1.5 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Exam Details Modal */}
      {viewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Award className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Exam Details</h3>
              </div>
              <button
                onClick={() => setViewExam(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100"
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
                    {viewExam.className}{viewExam.section ? ` (Section ${viewExam.section})` : ""}
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
                  <span className="text-xs text-slate-400 font-medium">Marks Configuration</span>
                  <p className="font-semibold text-slate-700">Total: {viewExam.totalMarks || 100} | Pass: {viewExam.passMarks || 40}</p>
                </div>
              </div>

              {viewExam.description && (
                <div>
                  <span className="text-xs text-slate-400 font-medium">Description / Rules</span>
                  <p className="mt-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    {viewExam.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setViewExam(null);
                  router.push("/admin/enterMarks");
                }}
                className="bg-[#0B386C]/80 hover:bg-indigo-950 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <PencilLine size={14} /> Enter Marks for this Exam
              </button>
              <button
                onClick={() => setViewExam(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HeroUI Alert Dialog for Delete Confirmation */}
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
                  Delete Examination?
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
                  ? This will permanently remove the exam schedule and its configuration. This action cannot be undone.
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
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isDisabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
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

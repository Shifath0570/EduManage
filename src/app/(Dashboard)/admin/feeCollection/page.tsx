"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import ReactPaginate from "react-paginate";

interface PaymentRecord {
  _id: string;
  studentId: string;
  paidAmount: number;
  paymentMethod: "Cash" | "Bkash" | "Nagad" | "Bank Transfer";
  paymentDate: string;
  remarks: string;
}

interface StudentFeeRecord {
  _id: string;
  studentId: string;
  name: string;
  roll: string;
  className: string;
  section: string;
  phone: string;
  totalFee: number;
  totalPaid: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Partial" | "Unpaid";
  paymentHistory: PaymentRecord[];
}

interface Summary {
  totalExpectedFees: number;
  totalPaidFees: number;
  totalDueFees: number;
}

const CLASS_OPTIONS = [
  "class_1", "class_2", "class_3", "class_4", "class_5",
  "class_6", "class_7", "class_8",
  "class_9_businessStudies", "class_9_humanities", "class_9_science",
  "class_10_businessStudies", "class_10_humanities", "class_10_science",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/fees` 
  : "http://localhost:5000/api/fees";

export default function FeeManagementPage() {
  const [students, setStudents] = useState<StudentFeeRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalExpectedFees: 0,
    totalPaidFees: 0,
    totalDueFees: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Server Pagination State
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed for react-paginate
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const itemsPerPage = 10;

  // Modal / Form State
  const [selectedStudent, setSelectedStudent] = useState<StudentFeeRecord | null>(null);
  const [collectAmount, setCollectAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [remarks, setRemarks] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch API Data with Server Pagination
  const fetchFees = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", (page + 1).toString()); // Backend expects 1-based index
      params.append("limit", itemsPerPage.toString());

      if (search) params.append("search", search);
      if (className) params.append("className", className);
      if (section) params.append("section", section);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
        setSummary(result.summary);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.totalRecords);
      } else {
        setError(result.message || "Failed to fetch fee data");
      }
    } catch (err) {
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, [search, className, section, paymentStatus, startDate, endDate]);

  // Fetch when page or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFees(currentPage);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchFees, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(0); // Reset page on filter update
  };

  const handleCollectFee = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !collectAmount || Number(collectAmount) <= 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          paidAmount: Number(collectAmount),
          paymentMethod,
          remarks,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSelectedStudent(null);
        setCollectAmount("");
        setRemarks("");
        fetchFees(currentPage);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert("Failed to submit payment request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Student Fee Management</h1>
            <p className="text-slate-500 text-sm">Monitor collections, dues, and payment logs</p>
          </div>
        </header>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Expected</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">${summary.totalExpectedFees.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-sm">
            <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">${summary.totalPaidFees.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-rose-100 bg-rose-50/20 shadow-sm">
            <span className="text-rose-600 text-xs font-semibold uppercase tracking-wider">Total Due</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">${summary.totalDueFees.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Filter Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Search ID, Name..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            />
            <select
              value={className}
              onChange={(e) => handleFilterChange(setClassName, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            >
              <option value="">All Classes</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Section (e.g. A)"
              value={section}
              onChange={(e) => handleFilterChange(setSection, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            />
            <select
              value={paymentStatus}
              onChange={(e) => handleFilterChange(setPaymentStatus, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            />
          </div>
        </div>

        {/* Data Table & Pagination */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading records...</div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500">{error}</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No student records found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-4">Student</th>
                      <th className="p-4">Class / Sec</th>
                      <th className="p-4">Total Fee</th>
                      <th className="p-4">Paid</th>
                      <th className="p-4">Due</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{student.name}</div>
                          <div className="text-xs text-slate-400">ID: {student.studentId} | Roll: {student.roll}</div>
                        </td>
                        <td className="p-4 capitalize">{student.className.replace(/_/g, " ")} ({student.section})</td>
                        <td className="p-4 font-medium">${student.totalFee}</td>
                        <td className="p-4 text-emerald-600 font-medium">${student.totalPaid}</td>
                        <td className="p-4 text-rose-600 font-medium">${student.dueAmount}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            student.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                            student.paymentStatus === "Partial" ? "bg-amber-100 text-amber-700" :
                            "bg-rose-100 text-rose-700"
                          }`}>
                            {student.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            disabled={student.dueAmount === 0}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs disabled:opacity-40"
                          >
                            Collect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ReactPaginate Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, totalRecords)} of {totalRecords} records
                  </span>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={totalPages}
                    previousLabel="< Prev"
                    forcePage={currentPage}
                    containerClassName="flex items-center gap-1 text-sm font-medium"
                    pageClassName="px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    activeClassName="!bg-indigo-600 !text-white !border-indigo-600"
                    previousClassName="px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    nextClassName="px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    disabledClassName="opacity-40 cursor-not-allowed pointer-events-none"
                    breakClassName="px-2 py-1 text-slate-400"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Collect Fee Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Collect Fee - {selectedStudent.name}</h3>
            <p className="text-xs text-slate-500">Student ID: {selectedStudent.studentId} | Current Due: ${selectedStudent.dueAmount}</p>

            <form onSubmit={handleCollectFee} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedStudent.dueAmount}
                  required
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Optional notes"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
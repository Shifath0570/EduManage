"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import ReactPaginate from "react-paginate";

interface SalaryRecord {
  _id: string;
  teacherId: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string;
  subjectSpecialization: string;
  baseSalary: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "Paid" | "Partial" | "Unpaid";
  lastPaymentDetails: {
    paymentMethod: string;
    paymentDate: string;
    remarks: string;
  } | null;
}

interface Summary {
  totalExpectedSalary: number;
  totalPaidSalary: number;
  totalDueSalary: number;
  totalActiveTeachers: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/salaries`
  : "http://localhost:5000/api/salaries";

export default function TeacherSalaryPage() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalExpectedSalary: 0,
    totalPaidSalary: 0,
    totalDueSalary: 0,
    totalActiveTeachers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState<string>("");
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const itemsPerPage = 10;

  // Modal / Form State
  const [selectedTeacher, setSelectedTeacher] = useState<SalaryRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number | "">(15000);
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
  const [remarks, setRemarks] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch Data
  const fetchSalaries = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", (page + 1).toString());
      params.append("limit", itemsPerPage.toString());

      if (search) params.append("search", search);
      if (month) params.append("month", month);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSalaries(result.data);
        setSummary(result.summary);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.totalRecords);
      } else {
        setError(result.message || "Failed to fetch salary data");
      }
    } catch (err) {
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }, [search, month, paymentStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSalaries(currentPage);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSalaries, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(0);
  };

  const handleDisburseSalary = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !payAmount || Number(payAmount) <= 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: selectedTeacher._id,
          amount: Number(payAmount),
          paymentMethod,
          month,
          remarks,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSelectedTeacher(null);
        setPayAmount(15000);
        setRemarks("");
        fetchSalaries(currentPage);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert("Failed to process payment request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Teacher Payroll Management</h1>
            <p className="text-slate-500 text-sm">Disburse salaries, view payment logs, and manage monthly dues</p>
          </div>
        </header>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Teachers</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">{summary.totalActiveTeachers}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Monthly Budget</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">৳{summary.totalExpectedSalary.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-sm">
            <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Total Disbursed</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">৳{summary.totalPaidSalary.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-rose-100 bg-rose-50/20 shadow-sm">
            <span className="text-rose-600 text-xs font-semibold uppercase tracking-wider">Total Pending Dues</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">৳{summary.totalDueSalary.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Filter Payroll</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search ID, Name, Phone..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
            />
            <input
              type="month"
              value={month}
              onChange={(e) => handleFilterChange(setMonth, e.target.value)}
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
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading payroll records...</div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500">{error}</div>
          ) : salaries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No active teacher records found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-4">Teacher</th>
                      <th className="p-4">Specialization</th>
                      <th className="p-4">Base Salary</th>
                      <th className="p-4">Paid</th>
                      <th className="p-4">Due</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salaries.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-slate-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={teacher.profilePhoto || "/placeholder.png"}
                            alt={teacher.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-800">{teacher.fullName}</div>
                            <div className="text-xs text-slate-400">ID: {teacher.employeeId} | {teacher.phone}</div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{teacher.subjectSpecialization}</td>
                        <td className="p-4 font-medium">৳{teacher.baseSalary.toLocaleString()}</td>
                        <td className="p-4 text-emerald-600 font-medium">৳{teacher.paidAmount.toLocaleString()}</td>
                        <td className="p-4 text-rose-600 font-medium">৳{teacher.dueAmount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            teacher.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                            teacher.paymentStatus === "Partial" ? "bg-amber-100 text-amber-700" :
                            "bg-rose-100 text-rose-700"
                          }`}>
                            {teacher.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setPayAmount(teacher.dueAmount > 0 ? teacher.dueAmount : 15000);
                            }}
                            disabled={teacher.dueAmount === 0}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs disabled:opacity-40"
                          >
                            Pay Salary
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
                    Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, totalRecords)} of {totalRecords} teachers
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

      {/* Disburse Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Pay Salary - {selectedTeacher.fullName}</h3>
            <p className="text-xs text-slate-500">Employee ID: {selectedTeacher.employeeId} | Month: {month}</p>

            <form onSubmit={handleDisburseSalary} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTeacher.dueAmount}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
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
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Optional notes (e.g. Transaction ID)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacher(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Disburse Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Eye, Edit3, UserCheck, ToggleLeft, ToggleRight, 
  Trash2, Search, Filter, RotateCcw, Plus, ChevronLeft, ChevronRight 
} from "lucide-react";

interface Student {
  _id: string;
  roll: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "Active" | "Inactive";
}

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
};

const getAvatarBg = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-600", 
    "bg-purple-100 text-purple-600", 
    "bg-green-100 text-green-600", 
    "bg-amber-100 text-amber-600", 
    "bg-rose-100 text-rose-600"
  ];
  return colors[index % colors.length];
};

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states (Default 10 students per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/api/students`);
        // const response = await fetch("/data/demo-students.json");
        const result = await response.json();
        if (result.success) setStudents(result.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Calculate pagination bounds
  const totalStudents = students.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage) || 1;

  // Slice current page data
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return students.slice(startIndex, startIndex + itemsPerPage);
  }, [students, currentPage, itemsPerPage]);

  // Display counters (Showing X to Y of Z)
  const startItemIndex = totalStudents === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalStudents);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-sm text-slate-500 mt-1">View, add, edit and manage all students.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition shrink-0">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Controls */}
        <div className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b border-slate-100">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, roll, email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 outline-none">
              <option>All Classes</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 outline-none">
              <option>All Sections</option>
            </select>
            <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800">
              <Filter size={14} /> Filter
            </button>
            <button className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-50">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">Loading student data...</td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No students found.</td>
                </tr>
              ) : (
                currentStudents.map((student, idx) => {
                  const overallIndex = (currentPage - 1) * itemsPerPage + idx;
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 text-center text-slate-500">{overallIndex + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs ${getAvatarBg(overallIndex)}`}>
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-400">
                              Roll: {student.roll} | {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{student.className}</td>
                      <td className="py-3 px-4 text-slate-600">{student.section}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          student.status === "Active" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" 
                            : "bg-rose-50 text-rose-500 border border-rose-200/50"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100"><Eye size={15} /></button>
                          <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md border border-purple-100"><Edit3 size={15} /></button>
                          <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md border border-amber-100"><UserCheck size={15} /></button>
                          <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md border border-emerald-100">
                            {student.status === "Active" ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                          </button>
                          <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md border border-rose-100"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

<<<<<<< HEAD
        {/* Pagination Footer */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500">
          <div>Showing 1 to {students.length} of 25 students</div>
          <div className="flex gap-1 items-center flex-wrap justify-center">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md font-medium">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50">3</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50">Next</button>
=======
        {/* Dynamic Pagination Footer */}
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div>
              Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalStudents}</span> students
            </div>

            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to page 1 on limit change
                }}
                className="bg-slate-50 border border-slate-200 text-xs rounded-md px-2 py-1 text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Page Buttons Controls */}
          <div className="flex gap-1 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  currentPage === page
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              Next <ChevronRight size={14} />
            </button>
>>>>>>> origin/main
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { icon: Eye, label: "View Details", desc: "See student full details", color: "text-blue-600 bg-blue-50" },
          { icon: Edit3, label: "Edit Student", desc: "Edit student information", color: "text-purple-600 bg-purple-50" },
          { icon: UserCheck, label: "Assign Class/Section", desc: "Assign to class & section", color: "text-amber-600 bg-amber-50" },
          { icon: ToggleRight, label: "Activate/Deactivate", desc: "Change student status", color: "text-emerald-600 bg-emerald-50" },
          { icon: Trash2, label: "Remove Student", desc: "Delete student record", color: "text-rose-500 bg-rose-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
            <div className={`p-2 rounded-md ${item.color}`}>
              <item.icon size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">{item.label}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



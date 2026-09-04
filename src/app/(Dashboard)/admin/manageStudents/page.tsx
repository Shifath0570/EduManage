
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Eye, ToggleLeft, ToggleRight, Trash2, Search, Filter, RotateCcw, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { StudentDeleteAction } from "@/app/component/StudentDeleteAction";
import { Button } from "@heroui/react";
import Link from "next/link";

interface Student {
  _id: string;
  roll: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "Active" | "Inactive";
  avatarUrl?: string;
  profileImage?: string;
}

const getInitials = (name: string) => {
  return name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?";
};

const getAvatarBg = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-purple-100 text-purple-600 border-purple-200",
    "bg-green-100 text-green-600 border-green-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-rose-100 text-rose-600 border-rose-200"
  ];
  return colors[index % colors.length];
};

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSection, setSelectedSection] = useState("All Sections");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(`${apiURL}/api/students`);
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

  // Extract unique options for dropdowns dynamically from API response
  const classOptions = useMemo(() => {
    const classes = Array.from(new Set(students.map((s) => s.className).filter(Boolean)));
    return ["All Classes", ...classes];
  }, [students]);

  const sectionOptions = useMemo(() => {
    const sections = Array.from(new Set(students.map((s) => s.section).filter(Boolean)));
    return ["All Sections", ...sections];
  }, [students]);

  // Filter students based on search term, selected class, and section
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        student.name?.toLowerCase().includes(query) ||
        student.roll?.toString().toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query);

      const matchesClass =
        selectedClass === "All Classes" || student.className === selectedClass;

      const matchesSection =
        selectedSection === "All Sections" || student.section === selectedSection;

      return matchesSearch && matchesClass && matchesSection;
    });
  }, [students, searchTerm, selectedClass, selectedSection]);

  // Calculate pagination bounds
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage) || 1;

  // Slice current page data from filtered list
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const startItemIndex = totalStudents === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalStudents);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("All Classes");
    setSelectedSection("All Sections");
    setCurrentPage(1);
  };

  const handleImageError = (studentId: string) => {
    setImageErrors((prev) => ({ ...prev, [studentId]: true }));
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        range.push("...");
      }
    }

    return range.filter((item, index, array) => item !== array[index - 1]);
  };

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-sm text-slate-500 mt-1">View, add, and manage all students.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Controls */}
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-slate-100">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, roll, email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {sectionOptions.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-50 transition"
            >
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
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Loading student data...
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No students found matching criteria.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student, idx) => {
                  const overallIndex = (currentPage - 1) * itemsPerPage + idx;
                  const photoUrl = student.profileImage || student.avatarUrl;
                  const hasValidPhoto = photoUrl && !imageErrors[student._id];

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 text-center text-slate-500">{overallIndex + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar Image or Initials Fallback */}
                          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200/60 shadow-sm flex items-center justify-center">
                            {hasValidPhoto ? (
                              <img
                                src={photoUrl}
                                alt={student.name}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(student._id)}
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center font-semibold text-xs ${getAvatarBg(overallIndex)}`}>
                                {getInitials(student.name)}
                              </div>
                            )}
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
                          <Link href={`/admin/manageStudents/${student._id}`}>
                            <Button className="p-1.5 text-blue-600 bg-white hover:bg-blue-50 rounded-md border border-blue-100">
                              <Eye size={15} />
                            </Button>
                          </Link>
                          <Button className="p-1.5 text-emerald-600 bg-white hover:bg-emerald-50 rounded-md border border-emerald-100">
                            {student.status === "Active" ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                          </Button>
                          <StudentDeleteAction studentId={student._id} studentName={student.name} />
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
                  setCurrentPage(1);
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

            {getPaginationRange().map((item, index) => {
              if (item === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-slate-400 font-medium">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  onClick={() => handlePageChange(Number(item))}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    currentPage === item
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        {[
          { icon: Eye, label: "View Details", desc: "See student full details", color: "text-blue-600 bg-blue-50" },
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


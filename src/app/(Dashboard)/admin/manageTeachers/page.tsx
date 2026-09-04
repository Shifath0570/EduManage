
'use client';

import { useEffect, useState, useMemo, ChangeEvent } from 'react';
import { Search, Eye, UserCheck, ToggleLeft, ToggleRight, RotateCcw, X, ChevronLeft, ChevronRight, Camera, Upload } from 'lucide-react';
import { Button } from '@heroui/react';
import Link from 'next/link';

interface Teacher {
  _id: string;
  teacherId: number;
  fullName: string;
  email: string;
  phone: string;
  subjectSpecialization: string[] | string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  profilePhoto?: string; // Added to resolve the red line TypeScript error
}

const ITEMS_PER_PAGE = 10;

const normalizeSubjects = (subjects: string[] | string | undefined | null): string[] => {
  if (Array.isArray(subjects)) return subjects;
  if (typeof subjects === 'string') return subjects.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 1;
  const range: (number | string)[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift('...');
  }
  if (currentPage + delta < totalPages - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
};

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Pagination state
  const [rawPage, setRawPage] = useState<number>(1);

  // Modal / Selection states
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | 'assignSubject' | 'add' | 'updateImage' | null>(null);

  // Image Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiURL}/api/teachers`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        if (json.success) setTeachers(json.data);
      } catch (err) {
        console.error('Failed to load teachers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      const subjects = normalizeSubjects(t.subjectSpecialization);
      subjects.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        teacher.fullName?.toLowerCase().includes(q) ||
        teacher.email?.toLowerCase().includes(q) ||
        teacher.phone?.toLowerCase().includes(q);

      const subjects = normalizeSubjects(teacher.subjectSpecialization);
      const matchesSubject = selectedSubject === 'All' || subjects.includes(selectedSubject);

      return matchesSearch && matchesSubject;
    });
  }, [teachers, searchQuery, selectedSubject]);

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTeachers, currentPage]);

  const paginationRange = useMemo(() => {
    return getPaginationRange(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setRawPage(1);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setRawPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setRawPage(1);
  };

  const handleToggleStatus = async (teacher: Teacher) => {
    const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';

    setTeachers((prev) =>
      prev.map((t) => (t._id === teacher._id ? { ...t, status: newStatus } : t))
    );

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
      await fetch(`${apiURL}/api/teachers/${teacher._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      setTeachers((prev) =>
        prev.map((t) => (t._id === teacher._id ? { ...t, status: teacher.status } : t))
      );
    }
  };

  const handleOpenImageModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setImagePreview(
      teacher.profilePhoto ||
      teacher.avatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teacher.fullName || 'default')}`
    );
    setImageFile(null);
    setActiveModal('updateImage');
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
    if (!selectedTeacher || !imageFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', imageFile);

      const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiURL}/api/teachers/${selectedTeacher._id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.avatarUrl) {
        setTeachers((prev) =>
          prev.map((t) => (t._id === selectedTeacher._id ? { ...t, avatarUrl: json.avatarUrl, profilePhoto: json.avatarUrl } : t))
        );
        closeModal();
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTeacher(null);
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Teachers</h1>
          <p className="text-sm text-slate-500 mt-1">View, add, and manage all teachers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Subjects</option>
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
            <p>Loading teacher data...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg">
            No teachers found matching your criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="pb-3 px-2">#</th>
                    <th className="pb-3 px-2">Teacher Info</th>
                    <th className="pb-3 px-2">Subject(s)</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTeachers.map((teacher, idx) => {
                    const teacherSubjects = normalizeSubjects(teacher.subjectSpecialization);
                    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    const avatarSrc =
                      teacher.profilePhoto ||
                      teacher.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        teacher.fullName || 'default'
                      )}`;

                    return (
                      <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2 text-slate-500">{globalIndex}</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="relative group w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                              <img
                                src={avatarSrc}
                                alt={teacher.fullName}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => handleOpenImageModal(teacher)}
                                title="Change Image"
                                className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Camera size={14} />
                              </button>
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{teacher.fullName}</div>
                              <div className="text-xs text-slate-400">
                                {teacher.email} | {teacher.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex flex-wrap gap-1">
                            {teacherSubjects.length > 0 ? (
                              teacherSubjects.map((sub, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                                >
                                  {sub}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-100 text-slate-500'
                              }`}
                          >
                            {teacher.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/admin/manageTeachers/${teacher._id}`}>
                              <Button className="p-1.5 text-blue-600 bg-white hover:bg-blue-50 rounded-md border border-blue-100">
                                <Eye size={15} />
                              </Button>
                            </Link>
                            <Link href={`/admin/manageTeachers/assing/${teacher._id}`}>
                              <Button className="p-1.5 text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition">
                                <UserCheck size={16} />
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleToggleStatus(teacher)}
                              className="p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 transition"
                            >
                              {teacher.status === 'Active' ? (
                                <ToggleRight size={18} className="text-emerald-600" />
                              ) : (
                                <ToggleLeft size={18} className="text-slate-400" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 text-sm text-slate-500">
              <div>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-700">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredTeachers.length)}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{filteredTeachers.length}</span> teachers
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRawPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>

                {paginationRange.map((item, index) =>
                  item === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-400 font-medium">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setRawPage(item as number)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === item
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setRawPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Upload Modal */}
      {activeModal === 'updateImage' && selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button onClick={closeModal} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Update Teacher Profile Photo</h3>
            <p className="text-sm text-slate-500 mb-6">
              Upload a profile photo for <span className="font-semibold text-slate-700">{selectedTeacher.fullName}</span>
            </p>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-indigo-100 shadow-sm relative">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <label className="w-full flex flex-col items-center px-4 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-600">Click to upload image</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                disabled={!imageFile || isUploading}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition flex items-center gap-2"
              >
                {isUploading ? 'Uploading...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

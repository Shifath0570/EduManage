// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { Search, Eye, Edit, UserCheck, BookOpen, ToggleLeft, ToggleRight, Plus, RotateCcw, Users, X } from 'lucide-react';

// interface Teacher {
//   _id: string;
//   teacherId: number;
//   name: string;
//   email: string;
//   phone: string;
//   subjectSpecialization: string[] | string;
//   className: string;
//   section: string;
//   studentCount: number;
//   status: 'Active' | 'Inactive';
// }

// // Helper to reliably format subjects as a string array regardless of API payload shape
// const normalizeSubjects = (subjects: string[] | string | undefined | null): string[] => {
//   if (Array.isArray(subjects)) return subjects;
//   if (typeof subjects === 'string') return subjects.split(',').map((s) => s.trim()).filter(Boolean);
//   return [];
// };

// export default function ManageTeachersPage() {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Search & Filter state
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [selectedSubject, setSelectedSubject] = useState<string>('All');
//   const [selectedClass, setSelectedClass] = useState<string>('All');
//   const [selectedSection, setSelectedSection] = useState<string>('All');

//   // Modal / Selection states
//   const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
//   const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'assignSubject' | 'assignClass' | 'add' | null>(null);

//   useEffect(() => {
//     async function fetchTeachers() {
//       try {
//         const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
//         const res = await fetch(`${apiURL}/api/teachers`);
//         if (!res.ok) throw new Error('Network response was not ok');
//         const json = await res.json();
//         if (json.success) setTeachers(json.data);
//       } catch (err) {
//         console.error('Failed to load teachers:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTeachers();
//   }, []);

//   // Safe extraction of dropdown options using normalizeSubjects
//   const subjectsList = useMemo(() => {
//     const set = new Set<string>();
//     teachers.forEach((t) => {
//       const subjects = normalizeSubjects(t.subjectSpecialization);
//       subjects.forEach((s) => set.add(s));
//     });
//     return Array.from(set);
//   }, [teachers]);

//   const classesList = useMemo(() => {
//     const set = new Set<string>();
//     teachers.forEach((t) => t.className && set.add(t.className));
//     return Array.from(set);
//   }, [teachers]);

//   const sectionsList = useMemo(() => {
//     const set = new Set<string>();
//     teachers.forEach((t) => t.section && set.add(t.section));
//     return Array.from(set);
//   }, [teachers]);

//   // Safe search and filtering implementation
//   const filteredTeachers = useMemo(() => {
//     return teachers.filter((teacher) => {
//       const q = searchQuery.toLowerCase().trim();
//       const matchesSearch =
//         !q ||
//         teacher.name?.toLowerCase().includes(q) ||
//         teacher.email?.toLowerCase().includes(q) ||
//         teacher.phone?.toLowerCase().includes(q);

//       const subjects = normalizeSubjects(teacher.subjectSpecialization);
//       const matchesSubject = selectedSubject === 'All' || subjects.includes(selectedSubject);
//       const matchesClass = selectedClass === 'All' || teacher.className === selectedClass;
//       const matchesSection = selectedSection === 'All' || teacher.section === selectedSection;

//       return matchesSearch && matchesSubject && matchesClass && matchesSection;
//     });
//   }, [teachers, searchQuery, selectedSubject, selectedClass, selectedSection]);

//   const handleResetFilters = () => {
//     setSearchQuery('');
//     setSelectedSubject('All');
//     setSelectedClass('All');
//     setSelectedSection('All');
//   };

//   const handleToggleStatus = async (teacher: Teacher) => {
//     const newStatus = teacher.status === 'Active' ? 'Inactive' : 'Active';

//     setTeachers((prev) =>
//       prev.map((t) => (t._id === teacher._id ? { ...t, status: newStatus } : t))
//     );

//     try {
//       const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
//       await fetch(`${apiURL}/api/teachers/${teacher._id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });
//     } catch (err) {
//       console.error('Failed to update status:', err);
//       setTeachers((prev) =>
//         prev.map((t) => (t._id === teacher._id ? { ...t, status: teacher.status } : t))
//       );
//     }
//   };

//   const closeModal = () => {
//     setActiveModal(null);
//     setSelectedTeacher(null);
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-800 p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Teachers</h1>
//           <p className="text-sm text-slate-500 mt-1">View, add, edit and manage all teachers.</p>
//         </div>
//         <button
//           onClick={() => setActiveModal('add')}
//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0 shadow-sm"
//         >
//           <Plus size={16} /> Add Teacher
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 overflow-hidden">
//         <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
//           <div className="relative flex-1 min-w-[240px]">
//             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by name, email, phone..."
//               className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div className="flex items-center gap-2.5 flex-wrap">
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="All">All Subjects</option>
//               {subjectsList.map((sub) => (
//                 <option key={sub} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="All">All Classes</option>
//               {classesList.map((cls) => (
//                 <option key={cls} value={cls}>
//                   {cls}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="All">All Sections</option>
//               {sectionsList.map((sec) => (
//                 <option key={sec} value={sec}>
//                   {sec}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={handleResetFilters}
//               className="flex items-center gap-1 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition"
//             >
//               <RotateCcw size={14} /> Reset
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="py-12 text-center text-slate-500">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
//             <p>Loading teacher data...</p>
//           </div>
//         ) : filteredTeachers.length === 0 ? (
//           <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-lg">
//             No teachers found matching your criteria.
//           </div>
//         ) : (
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-left text-sm min-w-[700px]">
//               <thead>
//                 <tr className="border-b border-slate-200 text-slate-500 font-medium">
//                   <th className="pb-3 px-2">#</th>
//                   <th className="pb-3 px-2">Teacher Info</th>
//                   <th className="pb-3 px-2">Subject(s)</th>
//                   <th className="pb-3 px-2">Class</th>
//                   <th className="pb-3 px-2">Section</th>
//                   <th className="pb-3 px-2">Students</th>
//                   <th className="pb-3 px-2">Status</th>
//                   <th className="pb-3 px-2 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredTeachers.map((teacher, idx) => {
//                   const teacherSubjects = normalizeSubjects(teacher.subjectSpecialization);
//                   return (
//                     <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
//                       <td className="py-4 px-2 text-slate-500">{idx + 1}</td>
//                       <td className="py-4 px-2">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
//                             <img
//                               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teacher.name || 'default')}`}
//                               alt={teacher.name}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div>
//                             <div className="font-semibold text-slate-900">{teacher.name}</div>
//                             <div className="text-xs text-slate-400">
//                               {teacher.email} | {teacher.phone}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-2">
//                         <div className="flex flex-wrap gap-1">
//                           {teacherSubjects.length > 0 ? (
//                             teacherSubjects.map((sub, i) => (
//                               <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
//                                 {sub}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-xs text-slate-400">-</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-4 px-2 text-slate-600">{teacher.className || '-'}</td>
//                       <td className="py-4 px-2 text-slate-600">{teacher.section || '-'}</td>
//                       <td className="py-4 px-2">
//                         <span className="flex items-center gap-1 text-slate-600">
//                           <Users size={14} className="text-slate-400" /> {teacher.studentCount ?? 0}
//                         </span>
//                       </td>
//                       <td className="py-4 px-2">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
//                           }`}
//                         >
//                           {teacher.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-2 text-right">
//                         <div className="flex items-center justify-end gap-1.5">
//                           <button
//                             onClick={() => {
//                               setSelectedTeacher(teacher);
//                               setActiveModal('view');
//                             }}
//                             className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
//                             title="View Teacher"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedTeacher(teacher);
//                               setActiveModal('edit');
//                             }}
//                             className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition"
//                             title="Edit Teacher"
//                           >
//                             <Edit size={16} />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedTeacher(teacher);
//                               setActiveModal('assignSubject');
//                             }}
//                             className="p-1.5 text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition"
//                             title="Assign Subject"
//                           >
//                             <UserCheck size={16} />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedTeacher(teacher);
//                               setActiveModal('assignClass');
//                             }}
//                             className="p-1.5 text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition"
//                             title="Assign Class/Section"
//                           >
//                             <BookOpen size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(teacher)}
//                             className="p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 transition"
//                             title="Toggle Status"
//                           >
//                             {teacher.status === 'Active' ? (
//                               <ToggleRight size={18} className="text-emerald-600" />
//                             ) : (
//                               <ToggleLeft size={18} className="text-slate-400" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {activeModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
//             <button onClick={closeModal} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
//               <X size={20} />
//             </button>
//             <h3 className="text-lg font-bold text-slate-900 capitalize mb-2">
//               {activeModal.replace(/([A-Z])/g, ' $1')}
//             </h3>
//             <p className="text-sm text-slate-500 mb-4">
//               {selectedTeacher ? `Target: ${selectedTeacher.name}` : 'Form action initialized.'}
//             </p>
//             <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Eye, Edit, UserCheck, BookOpen, ToggleLeft, ToggleRight, Plus, RotateCcw, Users, X } from 'lucide-react';
import { Button } from '@heroui/react';
import Link from 'next/link';

interface Teacher {
  _id: string;
  teacherId: number;
  fullName: string;
  email: string;
  phone: string;
  subjectSpecialization: string[] | string;
  className: string;
  section: string;
  studentCount: number;
  status: 'Active' | 'Inactive';
}

// Helper to reliably format subjects as a string array regardless of API payload shape
const normalizeSubjects = (subjects: string[] | string | undefined | null): string[] => {
  if (Array.isArray(subjects)) return subjects;
  if (typeof subjects === 'string') return subjects.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');

  // Modal / Selection states
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'assignSubject' | 'assignClass' | 'add' | null>(null);

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

  // Safe extraction of dropdown options using normalizeSubjects
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      const subjects = normalizeSubjects(t.subjectSpecialization);
      subjects.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [teachers]);

  const classesList = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => t.className && set.add(t.className));
    return Array.from(set);
  }, [teachers]);

  const sectionsList = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => t.section && set.add(t.section));
    return Array.from(set);
  }, [teachers]);

  // Safe search and filtering implementation
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
      const matchesClass = selectedClass === 'All' || teacher.className === selectedClass;
      const matchesSection = selectedSection === 'All' || teacher.section === selectedSection;

      return matchesSearch && matchesSubject && matchesClass && matchesSection;
    });
  }, [teachers, searchQuery, selectedSubject, selectedClass, selectedSection]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedClass('All');
    setSelectedSection('All');
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

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTeacher(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Teachers</h1>
          <p className="text-sm text-slate-500 mt-1">View, add, edit and manage all teachers.</p>
        </div>
        <button
          onClick={() => setActiveModal('add')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0 shadow-sm"
        >
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Subjects</option>
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Classes</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sections</option>
              {sectionsList.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
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
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-medium">
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Teacher Info</th>
                  <th className="pb-3 px-2">Subject(s)</th>
                  <th className="pb-3 px-2">Class</th>
                  <th className="pb-3 px-2">Section</th>
                  <th className="pb-3 px-2">Students</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher, idx) => {
                  const teacherSubjects = normalizeSubjects(teacher.subjectSpecialization);
                  return (
                    <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-2 text-slate-500">{idx + 1}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teacher.fullName || 'default')}`}
                              alt={teacher.fullName}
                              className="w-full h-full object-cover"
                            />
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
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                {sub}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-slate-600">{teacher.className || '-'}</td>
                      <td className="py-4 px-2 text-slate-600">{teacher.section || '-'}</td>
                      <td className="py-4 px-2">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users size={14} className="text-slate-400" /> {teacher.studentCount ?? 0}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/manageTeachers/${teacher._id}`}>
                            <Button className="p-1.5 text-blue-600 bg-white hover:bg-blue-50 rounded-md border border-blue-100"><Eye size={15} /></Button>
                          </Link>
                          <Button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setActiveModal('edit');
                            }}
                            className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setActiveModal('assignSubject');
                            }}
                            className="p-1.5 text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition"
                          >
                            <UserCheck size={16} />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setActiveModal('assignClass');
                            }}
                            className="p-1.5 text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition"
                          >
                            <BookOpen size={16} />
                          </Button>
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
        )}
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button onClick={closeModal} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 capitalize mb-2">
              {activeModal.replace(/([A-Z])/g, ' $1')}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {selectedTeacher ? `Target: ${selectedTeacher.fullName}` : 'Form action initialized.'}
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




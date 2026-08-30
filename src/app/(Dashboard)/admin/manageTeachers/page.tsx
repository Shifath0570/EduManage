
'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Edit, UserCheck, BookOpen, ToggleLeft, ToggleRight, Plus, Filter, RotateCcw, Users } from 'lucide-react';

interface Teacher {
  _id: string;
  teacherId: number;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  className: string;
  section: string;
  studentCount: number;
  status: 'Active' | 'Inactive';
}

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        // const res = await fetch('/api/teachers');
        const res = await fetch('/data/demoTeachers.json');
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Teachers</h1>
          <p className="text-sm text-slate-500 mt-1">View, add, edit and manage all teachers.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0">
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none">
              <option>All Subjects</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none">
              <option>All Classes</option>
            </select>
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none">
              <option>All Sections</option>
            </select>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="py-8 text-center text-slate-500">Loading teacher data...</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
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
                {teachers.map((teacher, idx) => (
                  <tr key={teacher._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} 
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{teacher.name}</div>
                          <div className="text-xs text-slate-400">
                            {teacher.email} | {teacher.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-600">{teacher.className}</td>
                    <td className="py-4 px-2 text-slate-600">{teacher.section}</td>
                    <td className="py-4 px-2">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users size={14} className="text-slate-400" /> {teacher.studentCount}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100" title="View Teacher"><Eye size={16} /></button>
                        <button className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100" title="Edit Teacher"><Edit size={16} /></button>
                        <button className="p-1.5 text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100" title="Assign Subject"><UserCheck size={16} /></button>
                        <button className="p-1.5 text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100" title="Assign Class/Section"><BookOpen size={16} /></button>
                        <button className="p-1.5 text-emerald-600 bg-slate-100 rounded-md hover:bg-slate-200" title="Toggle Status">
                          {teacher.status === 'Active' ? <ToggleRight size={18} className="text-emerald-600" /> : <ToggleLeft size={18} className="text-slate-400" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Eye size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-800">View Teacher</div>
            <div className="text-[10px] text-slate-400">View full teacher details</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md"><Edit size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-800">Edit Teacher</div>
            <div className="text-[10px] text-slate-400">Edit teacher information</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-md"><UserCheck size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-800">Assign Subject</div>
            <div className="text-[10px] text-slate-400">Assign subject to teacher</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md"><BookOpen size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-800">Assign Class/Section</div>
            <div className="text-[10px] text-slate-400">Assign class & section</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md"><ToggleRight size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-800">Activate/Deactivate</div>
            <div className="text-[10px] text-slate-400">Change teacher status</div>
          </div>
        </div>
      </div>
    </div>
  );
}
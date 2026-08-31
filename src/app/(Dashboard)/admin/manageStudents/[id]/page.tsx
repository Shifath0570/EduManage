'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  UserCheck,
  BookOpen,
  Layers,
  User,
  ShieldAlert,
  Edit,
  GraduationCap,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface Student {
  _id?: string;
  name: string;
  roll: string;
  email: string;
  phone: string;
  profileImage: string;
  className: string;
  section: string;
  status: 'Active' | 'Inactive';
  gender: 'male' | 'female' | 'other';
  guardianName: string;
  guardianPhone: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiURL}/api/students/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch student details (${res.status})`);
        }

        const result = await res.json();
        setStudent(result.data || result);
      } catch (err: any) {
        console.error('Error fetching student details:', err);
        setError(err.message || 'An unexpected error occurred while fetching details.');
      }  {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Helper to display class names cleanly (e.g., class_1 -> Class 1)
  const formatClassName = (name?: string) => {
    if (!name) return '-';
    return name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center space-y-3 text-slate-500">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading student details...</p>
      </div>
    );
  }

  // Error State
  if (error || !student) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 p-6 bg-white border border-rose-100 rounded-xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Failed to Load Student</h2>
          <p className="text-sm text-slate-500 mt-1">{error || 'Student information could not be found.'}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/students"
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} /> Back to List
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <RotateCcw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans text-slate-800 p-4 sm:p-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/students"
            className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Student Profile</h1>
            <p className="text-xs sm:text-sm text-slate-500">Detailed information for Roll #{student.roll}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/students/edit/${studentId}`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Edit size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner mb-4">
            {!imgError && student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-2xl">
                {student.name ? student.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Roll: {student.roll}</p>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                student.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}
            >
              {student.status}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium capitalize">
              {student.gender}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 my-6"></div>

          {/* Quick Contact Info */}
          <div className="w-full space-y-3 text-left text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span>{student.phone}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" size={20} /> Academic Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <BookOpen size={14} /> Class
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {formatClassName(student.className)}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Layers size={14} /> Section
                </div>
                <div className="text-sm font-bold text-slate-800">Section {student.section}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <UserCheck size={14} /> Roll Number
                </div>
                <div className="text-sm font-bold text-slate-800">{student.roll}</div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" size={20} /> Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <User size={14} /> Guardian Name
                </div>
                <div className="text-sm font-bold text-slate-800">{student.guardianName || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Phone size={14} /> Guardian Phone
                </div>
                <div className="text-sm font-bold text-slate-800">{student.guardianPhone || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
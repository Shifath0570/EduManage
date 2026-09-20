
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
  RotateCcw,
  Calendar,
  MapPin,
  IdCard,
  BookMarked
} from 'lucide-react';

interface Student {
  _id?: string;
  studentId?: string;
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
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  subjects?: string[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

interface JwtResponse { 
  token?: string; 
  message?: string; 
}

export default function StudentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const studentIdParam = resolvedParams.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

   const getJwt = async (): Promise<string> => { 
    const response = await fetch("/api/auth/token", { 
      credentials: "include", 
      headers: { Accept: "application/json" }, 
    }); 
    const result: JwtResponse = await response.json().catch(() => ({})); 
 
    if (!response.ok || !result.token) { 
      throw new Error(result.message || "You must be signed in to create notices."); 
    } 
    return result.token; 
  };

  useEffect(() => {
    if (!studentIdParam) return;

    const fetchStudentDetails = async () => {
      setLoading(true);
      setError(null);

      try {
         const token = await getJwt(); 
        const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiURL}/api/students/${studentIdParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}` 
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch student details (${res.status})`
          );
        }

        const result = await res.json();
        setStudent(result.data || result);
      } catch (err: unknown) {
        console.error('Error fetching student details:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentIdParam]);

  // Helper to display class names cleanly (e.g., class_1 -> Class 1)
  const formatClassName = (name?: string) => {
    if (!name) return '-';
    return name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper to format date strings cleanly
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center space-y-3 text-slate-500 bg-slate-50/50">
        <Loader2 size={36} className="animate-spin text-indigo-600" />
        <p className="text-sm font-semibold tracking-wide text-slate-600">Loading student details...</p>
      </div>
    );
  }

  // Error State
  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white border border-rose-100 rounded-2xl shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Failed to Load Student</h2>
            <p className="text-xs text-slate-500 mt-1">
              {error || 'Student information could not be found.'}
            </p>
          </div>
          <div className="flex justify-center gap-2.5 pt-2">
            <Link
              href="/admin/manageStudents"
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
            >
              <ArrowLeft size={16} /> Back to List
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition shadow-2xs cursor-pointer"
            >
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/manageStudents"
              className="p-2 text-slate-600 bg-white hover:text-indigo-600 hover:bg-indigo-50/50 border border-slate-200/80 rounded-xl transition shadow-2xs"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Student Profile
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Detailed information for {student.studentId || `Roll #${student.roll}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/manageStudents/edit/${studentIdParam}`}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-2xs"
            >
              <Edit size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Personal Info */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-indigo-50 shadow-inner mb-4 ring-2 ring-slate-100">
              {!imgError && student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={student.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-extrabold text-2xl">
                  {student.name ? student.name.slice(0, 2).toUpperCase() : 'ST'}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>

            {student.studentId && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-full mt-1.5">
                <IdCard size={13} /> {student.studentId}
              </span>
            )}

            <p className="text-xs font-semibold text-slate-500 font-mono mt-1">
              Roll: {student.roll}
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  student.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {student.status}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold capitalize border border-slate-200/60">
                {student.gender}
              </span>
            </div>

            <div className="w-full border-t border-slate-100 my-6"></div>

            {/* Quick Contact & Personal Details */}
            <div className="w-full space-y-3 text-left text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <Mail size={16} className="text-indigo-500 shrink-0" />
                <span className="truncate font-medium">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <Phone size={16} className="text-indigo-500 shrink-0" />
                <span className="font-medium">{student.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <Calendar size={16} className="text-indigo-500 shrink-0" />
                <span className="font-medium">DOB: {formatDate(student.dateOfBirth)}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                <MapPin size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <span className="font-medium">{student.address || '-'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="text-indigo-600" size={20} /> Academic Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <BookOpen size={14} className="text-indigo-500" /> Class
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {formatClassName(student.className)}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <Layers size={14} className="text-indigo-500" /> Section
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Section {student.section}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <UserCheck size={14} className="text-indigo-500" /> Roll Number
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {student.roll}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <Calendar size={14} className="text-indigo-500" /> Admission Date
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {formatDate(student.admissionDate)}
                  </div>
                </div>
              </div>

              {/* Enrolled Subjects */}
              {student.subjects && student.subjects.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                    <BookMarked size={14} className="text-indigo-600" /> Enrolled Subjects
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-xl text-xs font-semibold"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guardian Information */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="text-indigo-600" size={20} /> Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <User size={14} className="text-indigo-500" /> Guardian Name
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {student.guardianName || '-'}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <Phone size={14} className="text-indigo-500" /> Guardian Phone
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {student.guardianPhone || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









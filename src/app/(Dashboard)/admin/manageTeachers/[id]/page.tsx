'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  ShieldAlert,
  Edit,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Briefcase,
  MapPin,
  Calendar,
  Droplet,
  Award,
  BookOpenCheck,
  IdCard,
  Building
} from 'lucide-react';

interface Teacher {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  profilePhoto: string;
  qualifications: string;
  experienceYears: number;
  subjectSpecialization: string;
  joiningDate: string;
  employeeId: string;
  address: string;
  city: string;
  stateProvince: string;
  postCode: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContact: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams.id;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiURL}/api/teachers/${teacherId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch teacher details (${res.status})`);
        }

        const result = await res.json();
        setTeacher(result.data || result);
      } catch (err: any) {
        console.error('Error fetching teacher details:', err);
        setError(err.message || 'An unexpected error occurred while fetching details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  // Helper to format ISO dates (e.g. 1997-12-08 -> Dec 8, 1997)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center space-y-3 text-slate-500">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading teacher details...</p>
      </div>
    );
  }

  // Error State
  if (error || !teacher) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 p-6 bg-white border border-rose-100 rounded-xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Failed to Load Teacher</h2>
          <p className="text-sm text-slate-500 mt-1">{error || 'Teacher information could not be found.'}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/teachers"
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
            href="/teachers"
            className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Teacher Profile</h1>
            <p className="text-xs sm:text-sm text-slate-500">ID: {teacher.employeeId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/teachers/edit/${teacherId}`}
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
            {!imgError && teacher.profilePhoto ? (
              <img
                src={teacher.profilePhoto}
                alt={teacher.fullName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-2xl">
                {teacher.fullName ? teacher.fullName.slice(0, 2).toUpperCase() : 'TC'}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900">{teacher.fullName}</h2>
          <p className="text-xs text-indigo-600 font-semibold mt-0.5">{teacher.subjectSpecialization} Teacher</p>

          <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
              ID: {teacher.employeeId}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium capitalize">
              {teacher.gender}
            </span>
            {teacher.bloodGroup && (
              <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-medium flex items-center gap-1">
                <Droplet size={12} /> {teacher.bloodGroup}
              </span>
            )}
          </div>

          <div className="w-full border-t border-slate-100 my-6"></div>

          {/* Quick Contact Info */}
          <div className="w-full space-y-3 text-left text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate">{teacher.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span>{teacher.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span>DOB: {formatDate(teacher.dateOfBirth)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional & Academic Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} /> Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <BookOpenCheck size={14} /> Specialization
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.subjectSpecialization || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Award size={14} /> Qualification
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.qualifications || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <IdCard size={14} /> Experience
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {teacher.experienceYears} {teacher.experienceYears === 1 ? 'Year' : 'Years'}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Calendar size={14} /> Joining Date
                </div>
                <div className="text-sm font-bold text-slate-800">{formatDate(teacher.joiningDate)}</div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="text-indigo-600" size={20} /> Address & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Building size={14} /> Street Address
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.address || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <MapPin size={14} /> City / State
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {teacher.city ? `${teacher.city}, ${teacher.stateProvince}` : '-'}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <IdCard size={14} /> Postal Code
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.postCode || '-'}</div>
              </div>
            </div>
          </div>

          {/* Guardian & Emergency Contacts */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" size={20} /> Guardian & Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <User size={14} /> Guardian Name
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.guardianName || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Phone size={14} /> Guardian Phone
                </div>
                <div className="text-sm font-bold text-slate-800">{teacher.guardianPhone || '-'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                  <Phone size={14} /> Emergency Contact
                </div>
                <div className="text-sm font-bold text-rose-600">{teacher.emergencyContact || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
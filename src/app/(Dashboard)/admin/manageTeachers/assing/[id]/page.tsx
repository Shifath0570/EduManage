
"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button, Card, Avatar, AvatarImage, AvatarFallback, Spinner } from "@heroui/react";
import { Mail, Phone, Briefcase, Edit3, ArrowLeft, Save, ChevronDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import AssingSSC from "@/app/component/AssingSSC";
import CurrentAssingment from "@/app/component/CurrentAssingment";

interface TeacherData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  designation?: string;
  profilePhoto?: string;
  subjectSpecialization?: string;
}

export default function AssignTeacherPage(): React.ReactElement {
  const [fetching, setFetching] = useState<boolean>(true);
  const [teacher, setTeacher] = useState<TeacherData | null>(null);



  const router = useRouter();
  const params = useParams();
  const teacherIdParam = params?.id as string;

  const { data: session } = useSession();
  const user = session?.user;

  // Fetch teacher details on load
  useEffect(() => {
    if (!teacherIdParam) return;

    const fetchTeacherDetails = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiURL}/api/teachers/${teacherIdParam}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to fetch teacher profile.");
        }

        setTeacher(data.data || data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error loading profile.";
        alert(errorMessage);
      } finally {
        setFetching(false);
      }
    };

    fetchTeacherDetails();
  }, [teacherIdParam]);


  // if (fetching) {
  //   return (
  //     <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
  //       <Spinner size="lg" color="primary" />
  //       <p className="text-sm font-medium text-slate-500">Loading teacher details...</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="mx-auto w-[90%] px-6">
        {/* Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </div>

        {/* Top Banner Card matching design */}
        <Card className="mb-8 flex flex-col justify-between gap-6 border border-slate-200/80 bg-white p-6 shadow-xs rounded-2xl sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 ring-2 ring-slate-100">
              {teacher?.profilePhoto && <AvatarImage src={teacher.profilePhoto} alt={teacher.fullName} />}
              <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-bold">
                {teacher?.fullName ? teacher.fullName.slice(0, 2).toUpperCase() : "TC"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-[#081838]">
                Teacher: {teacher?.fullName || "N/A"}
              </h1>
              <div className="flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {teacher?.email || "N/A"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {teacher?.phone || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span>{teacher?.designation || teacher?.subjectSpecialization || "Senior Teacher"}</span>
              </div>
            </div>
          </div>

          {/* <Button
          type="button"
          onClick={() => router.push(`/admin/manageTeachers/edit/${teacherIdParam}`)}
          className="flex items-center gap-2 border border-purple-200 bg-white font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700"
        >
          <Edit3 className="h-4 w-4" /> Edit Teacher Info
        </Button> */}
        </Card>
      </div>
      <AssingSSC></AssingSSC>

      <CurrentAssingment></CurrentAssingment>
    </div>
  );
}



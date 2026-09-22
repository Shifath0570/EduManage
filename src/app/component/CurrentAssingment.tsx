
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import {
  BookOpen,
  Landmark,
  Users,
  Calendar,
  Trash2,
  Info,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface RawAssignment {
  _id?: string;
  id?: string;
  teacherId?: string | { _id?: string; id?: string };
  subjectId?: string;
  classId?: string;
  sectionId?: string;
  academicYear?: string;
  assignedDate?: string;
}

interface Assignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  academicYear: string;
  assignedDate: string;
}


export default function CurrentAssignment(): React.ReactElement {
  const params = useParams();
  const router = useRouter();

  // Extract teacherId from route dynamic params safely
  const rawId = params?.id;
  const teacherIdParam = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  const [fetching, setFetching] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = useCallback(async (): Promise<void> => {
    if (!teacherIdParam) {
      setAssignments([]);
      setFetching(false);
      return;
    }

    try {
      setFetching(true);
      const apiURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

      const endpoint = `${apiURL}/api/assignments?teacherId=${teacherIdParam}`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Extract array safely from data, data.data, or data.assignments
        const rawData: RawAssignment[] = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.assignments)
          ? data.assignments
          : [];

        // Normalize and safely map assignments
        const teacherAssignments = rawData
          .filter((item) => {
            // Support both string IDs and populated object IDs
            const tId =
              typeof item.teacherId === "object"
                ? item.teacherId?._id || item.teacherId?.id
                : item.teacherId;

            // If the API endpoint already filtered by teacherId, accept all returned items
            return tId ? String(tId) === String(teacherIdParam) : true;
          })
          .map((item) => {
            let formattedDate = "N/A";
            if (item.assignedDate) {
              const d = new Date(item.assignedDate);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              }
            }

            return {
              id: String(item._id || item.id || Math.random()),
              teacherId: String(
                typeof item.teacherId === "object"
                  ? item.teacherId?._id || item.teacherId?.id
                  : item.teacherId || ""
              ),
              subjectId: item.subjectId || "N/A",
              classId: item.classId || "N/A",
              sectionId: item.sectionId || "N/A",
              academicYear: item.academicYear || "N/A",
              assignedDate: formattedDate,
            };
          });

        setAssignments(teacherAssignments);
      } else {
        throw new Error(data.message || "Failed to fetch assignments.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching assignments.";
      alert(errorMessage);
    } finally {
      setFetching(false);
    }
  }, [teacherIdParam]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDeleteAssignment = async (assignmentId: string): Promise<void> => {
    if (!assignmentId) {
      alert("Invalid Assignment ID.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to remove this assignment?");
    if (!confirmDelete) return;

    setDeletingId(assignmentId);
    try {
      const apiURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

      const res = await fetch(`${apiURL}/api/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete assignment.");
      }

      setAssignments((prev) => prev.filter((item) => item.id !== assignmentId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error deleting assignment.";
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="mb-6 text-lg font-bold text-[#081838]">
          Current Assignments
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200/60">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Section</th>
                <th className="px-6 py-4">Academic Year</th>
                <th className="px-6 py-4">Assigned Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fetching ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Loading assignments...</span>
                    </div>
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active assignments found for this teacher.
                  </td>
                </tr>
              ) : (
                assignments.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        <span>{item.subjectId}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Landmark className="h-4 w-4 text-blue-600" />
                        <span>{item.classId}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <span>{item.sectionId}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{item.academicYear}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{item.assignedDate}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleDeleteAssignment(item.id)}
                        isDisabled={deletingId === item.id}
                        className="border border-red-200 bg-white font-medium text-red-500 hover:bg-red-50"
                      >
                        {deletingId === item.id ? (
                          <Spinner size="sm" color="danger" />
                        ) : (
                          <>
                            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Delete
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Info className="h-4 w-4 text-slate-400" />
          <span>You can assign multiple subjects and classes.</span>
        </div>
      </Card>
    </div>
  );
}



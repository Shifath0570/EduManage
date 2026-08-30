"use client";

import React, { useState } from "react";

type UserRole = "admin" | "teacher" | "student";

interface Student {
  id: string;
  name: string;
  roll: string;
  className: string;
  section: string;
}

interface ResultItem {
  subject: string;
  marks: number;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  section: string;
  exam: string;
  results: ResultItem[];
  total: number;
  gpa: number;
  grade: string;
}

// ============================================
// Mock Students
// Later backend API will provide this data
// ============================================

const students: Student[] = [
  {
    id: "student-1",
    name: "Rahim",
    roll: "01",
    className: "10",
    section: "A",
  },
  {
    id: "student-2",
    name: "Karim",
    roll: "02",
    className: "10",
    section: "A",
  },
  {
    id: "student-3",
    name: "Hasan",
    roll: "03",
    className: "10",
    section: "B",
  },
  {
    id: "student-4",
    name: "Ahmed",
    roll: "04",
    className: "9",
    section: "A",
  },
];

// ============================================
// Mock Results
// ============================================

const results: StudentResult[] = [
  {
    studentId: "student-1",
    studentName: "Rahim",
    roll: "01",
    className: "10",
    section: "A",
    exam: "Mid Term Examination",
    results: [
      {
        subject: "Bangla",
        marks: 85,
      },
      {
        subject: "English",
        marks: 78,
      },
      {
        subject: "Mathematics",
        marks: 92,
      },
      {
        subject: "Physics",
        marks: 81,
      },
      {
        subject: "Chemistry",
        marks: 88,
      },
    ],
    total: 424,
    gpa: 4.5,
    grade: "A+",
  },

  {
    studentId: "student-2",
    studentName: "Karim",
    roll: "02",
    className: "10",
    section: "A",
    exam: "Mid Term Examination",
    results: [
      {
        subject: "Bangla",
        marks: 72,
      },
      {
        subject: "English",
        marks: 75,
      },
      {
        subject: "Mathematics",
        marks: 80,
      },
      {
        subject: "Physics",
        marks: 76,
      },
      {
        subject: "Chemistry",
        marks: 82,
      },
    ],
    total: 385,
    gpa: 4.0,
    grade: "A",
  },

  {
    studentId: "student-3",
    studentName: "Hasan",
    roll: "03",
    className: "10",
    section: "B",
    exam: "Final Examination",
    results: [
      {
        subject: "Bangla",
        marks: 88,
      },
      {
        subject: "English",
        marks: 84,
      },
      {
        subject: "Mathematics",
        marks: 95,
      },
      {
        subject: "Physics",
        marks: 90,
      },
      {
        subject: "Chemistry",
        marks: 91,
      },
    ],
    total: 448,
    gpa: 5.0,
    grade: "A+",
  },

  {
    studentId: "student-4",
    studentName: "Ahmed",
    roll: "04",
    className: "9",
    section: "A",
    exam: "Mid Term Examination",
    results: [
      {
        subject: "Bangla",
        marks: 70,
      },
      {
        subject: "English",
        marks: 68,
      },
      {
        subject: "Mathematics",
        marks: 75,
      },
      {
        subject: "Science",
        marks: 72,
      },
      {
        subject: "ICT",
        marks: 80,
      },
    ],
    total: 365,
    gpa: 3.8,
    grade: "A-",
  },
];

// ============================================
// Main Component
// ============================================

const ViewResults = () => {
  // ============================================
  // Current User Role
  //
  // Later this can come from Auth Context
  // ============================================

  const [role, setRole] = useState<UserRole>("admin");

  // ============================================
  // Admin States
  // ============================================

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedExam, setSelectedExam] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState<StudentResult | null>(null);

  // ============================================
  // Teacher States
  // ============================================

  const [teacherClass, setTeacherClass] =
    useState("");

  const [teacherSubject, setTeacherSubject] =
    useState("");

  // ============================================
  // Student States
  // ============================================

  const [studentExam, setStudentExam] =
    useState("");

  // ============================================
  // Admin Search
  // ============================================

  const handleAdminSearch = () => {
    if (
      !selectedClass ||
      !selectedExam ||
      !selectedSubject
    ) {
      alert(
        "Please select Class, Exam and Subject."
      );

      return;
    }

    const result = results.find(
      (item) =>
        item.className === selectedClass &&
        item.exam === selectedExam &&
        item.results.some(
          (subject) =>
            subject.subject === selectedSubject
        )
    );

    if (!result) {
      alert("No result found.");
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(result);
  };

  // ============================================
  // Teacher Search
  // ============================================

  const handleTeacherSearch = () => {
    if (!teacherClass || !teacherSubject) {
      alert(
        "Please select Class and Subject."
      );

      return;
    }

    const result = results.find(
      (item) =>
        item.className === teacherClass &&
        item.results.some(
          (subject) =>
            subject.subject === teacherSubject
        )
    );

    if (!result) {
      alert("No result found.");
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(result);
  };

  // ============================================
  // Student Result
  // ============================================

  const handleStudentResult = () => {
    if (!studentExam) {
      alert("Please select an exam.");
      return;
    }

    const result = results.find(
      (item) =>
        item.studentId === "student-1" &&
        item.exam === studentExam
    );

    if (!result) {
      alert("No result found.");
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(result);
  };

  // ============================================
  // Close Result
  // ============================================

  const handleCloseResult = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-6xl">

        {/* ========================================
            Header
        ======================================== */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {role === "student"
              ? "My Results"
              : "View Results"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {role === "admin" &&
              "View and manage all student results."}

            {role === "teacher" &&
              "View results for your assigned classes and subjects."}

            {role === "student" &&
              "View your examination results."}
          </p>
        </div>

        {/* ========================================
            Role Selector
            Remove this after connecting Auth
        ======================================== */}

        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <p className="mb-3 text-sm font-medium text-yellow-800">
            Demo Role Selector
          </p>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setSelectedStudent(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                role === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("teacher");
                setSelectedStudent(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                role === "teacher"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Teacher
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("student");
                setSelectedStudent(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                role === "student"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Student
            </button>

          </div>
        </div>

        {/* ========================================
            ADMIN
        ======================================== */}

        {role === "admin" && (
          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Search Student Result
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Class */}

              <div>
                <label
                  htmlFor="adminClass"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Class
                </label>

                <select
                  id="adminClass"
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Class
                  </option>

                  <option value="9">
                    Class 9
                  </option>

                  <option value="10">
                    Class 10
                  </option>
                </select>
              </div>

              {/* Exam */}

              <div>
                <label
                  htmlFor="adminExam"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Exam
                </label>

                <select
                  id="adminExam"
                  value={selectedExam}
                  onChange={(e) =>
                    setSelectedExam(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Exam
                  </option>

                  <option value="Mid Term Examination">
                    Mid Term Examination
                  </option>

                  <option value="Final Examination">
                    Final Examination
                  </option>
                </select>
              </div>

              {/* Subject */}

              <div>
                <label
                  htmlFor="adminSubject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Subject
                </label>

                <select
                  id="adminSubject"
                  value={selectedSubject}
                  onChange={(e) =>
                    setSelectedSubject(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Subject
                  </option>

                  <option value="Bangla">
                    Bangla
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Mathematics">
                    Mathematics
                  </option>

                  <option value="Physics">
                    Physics
                  </option>

                  <option value="Chemistry">
                    Chemistry
                  </option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdminSearch}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              View Result
            </button>
          </div>
        )}

        {/* ========================================
            TEACHER
        ======================================== */}

        {role === "teacher" && (
          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              My Classes & Subjects
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* My Classes */}

              <div>
                <label
                  htmlFor="teacherClass"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  My Classes
                </label>

                <select
                  id="teacherClass"
                  value={teacherClass}
                  onChange={(e) =>
                    setTeacherClass(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Class
                  </option>

                  <option value="9">
                    Class 9
                  </option>

                  <option value="10">
                    Class 10
                  </option>
                </select>
              </div>

              {/* My Subjects */}

              <div>
                <label
                  htmlFor="teacherSubject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  My Subjects
                </label>

                <select
                  id="teacherSubject"
                  value={teacherSubject}
                  onChange={(e) =>
                    setTeacherSubject(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Subject
                  </option>

                  <option value="Bangla">
                    Bangla
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Mathematics">
                    Mathematics
                  </option>

                  <option value="Physics">
                    Physics
                  </option>

                  <option value="Chemistry">
                    Chemistry
                  </option>
                </select>
              </div>

            </div>

            <button
              type="button"
              onClick={handleTeacherSearch}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              View Results
            </button>
          </div>
        )}

        {/* ========================================
            STUDENT
        ======================================== */}

        {role === "student" && (
          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Select Examination
            </h2>

            <div className="max-w-md">

              <label
                htmlFor="studentExam"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select Exam
              </label>

              <select
                id="studentExam"
                value={studentExam}
                onChange={(e) =>
                  setStudentExam(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Exam
                </option>

                <option value="Mid Term Examination">
                  Mid Term Examination
                </option>

                <option value="Final Examination">
                  Final Examination
                </option>
              </select>

              <button
                type="button"
                onClick={handleStudentResult}
                className="mt-5 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                View My Result
              </button>

            </div>
          </div>
        )}

        {/* ========================================
            RESULT CARD
        ======================================== */}

        {selectedStudent && (
          <div className="mt-6 rounded-2xl bg-white shadow-sm">

            {/* Result Header */}

            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedStudent.exam}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Student Result
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseResult}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {/* Student Information */}

            <div className="grid grid-cols-2 gap-4 border-b p-5 md:grid-cols-4 md:p-6">

              <div>
                <p className="text-xs text-gray-500">
                  Student Name
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedStudent.studentName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Roll
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedStudent.roll}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Class
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedStudent.className}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Section
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedStudent.section}
                </p>
              </div>

            </div>

            {/* Subject Results */}

            <div className="p-5 md:p-6">

              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Subject Results
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">

                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        #
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Subject
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                        Marks
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedStudent.results.map(
                      (item, index) => (
                        <tr
                          key={item.subject}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >

                          <td className="px-4 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4 font-medium text-gray-800">
                            {item.subject}
                          </td>

                          <td className="px-4 py-4 text-right font-semibold text-gray-800">
                            {item.marks}
                          </td>

                          <td className="px-4 py-4 text-right">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                item.marks >= 40
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.marks >= 40
                                ? "Passed"
                                : "Failed"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            {/* ======================================
                Result Summary
            ====================================== */}

            <div className="grid grid-cols-1 gap-4 border-t bg-gray-50 p-5 sm:grid-cols-3 md:p-6">

              {/* Total */}

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Marks
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedStudent.total}
                </p>
              </div>

              {/* GPA */}

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  GPA
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {selectedStudent.gpa.toFixed(2)}
                </p>
              </div>

              {/* Grade */}

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Grade
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {selectedStudent.grade}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewResults; 
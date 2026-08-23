"use client";

import  { useState } from "react";

interface Student {
    id: number;
    name: string;
    roll: string;
}

interface StudentMark {
    studentId: number;
    studentName: string;
    roll: string;
    marks: string;
}

const students: Student[] = [
    {
        id: 1,
        name: "Rahim",
        roll: "01",
    },
    {
        id: 2,
        name: "Karim",
        roll: "02",
    },
    {
        id: 3,
        name: "Hasan",
        roll: "03",
    },
    {
        id: 4,
        name: "Ahmed",
        roll: "04",
    },
    {
        id: 5,
        name: "Sakib",
        roll: "05",
    },
];

const  EnterResult = () => {
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [marks, setMarks] = useState<StudentMark[]>(
        students.map((student) => ({
            studentId: student.id,
            studentName: student.name,
            roll: student.roll,
            marks: "",
        }))
    );

    const [showStudents, setShowStudents] = useState(false);
    const [saving, setSaving] = useState(false);

    const totalMarks = 100;

    // ============================================
    // Handle Marks Change
    // ============================================

    const handleMarksChange = (
        studentId: number,
        value: string
    ) => {
        if (value === "") {
            setMarks((prev) =>
                prev.map((student) =>
                    student.studentId === studentId
                        ? { ...student, marks: "" }
                        : student
                )
            );

            return;
        }

        const numericValue = Number(value);

        if (numericValue < 0 || numericValue > totalMarks) {
            return;
        }

        setMarks((prev) =>
            prev.map((student) =>
                student.studentId === studentId
                    ? {
                        ...student,
                        marks: value,
                    }
                    : student
            )
        );
    };

    // ============================================
    // Load Students
    // ============================================

    const handleLoadStudents = () => {
        if (
            !selectedExam ||
            !selectedClass ||
            !selectedSubject
        ) {
            alert(
                "Please select Exam, Class and Subject first."
            );

            return;
        }

        setShowStudents(true);
    };

    // ============================================
    // Save Marks
    // ============================================

    const handleSaveMarks = async () => {
        const incomplete = marks.some(
            (student) => student.marks === ""
        );

        if (incomplete) {
            alert("Please enter marks for all students.");
            return;
        }

        try {
            setSaving(true);

            const resultData = {
                examId: selectedExam,
                classId: selectedClass,
                subjectId: selectedSubject,
                totalMarks,
                students: marks.map((student) => ({
                    studentId: student.studentId,
                    studentName: student.studentName,
                    roll: student.roll,
                    marks: Number(student.marks),
                })),
            };

            // ============================================
            // Backend API পরে এখানে বসাবে
            // ============================================

            console.log("Result Data:", resultData);

            /*
            const response = await fetch(
              "YOUR_BACKEND_API_URL/results",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(resultData),
              }
            );
      
            if (!response.ok) {
              throw new Error("Failed to save marks");
            }
            */

            await new Promise((resolve) =>
                setTimeout(resolve, 800)
            );

            alert("Marks saved successfully!");
        } catch (error) {
            console.error("Save Marks Error:", error);

            alert("Failed to save marks.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">

                {/* ==========================================
            Header
        ========================================== */}

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Enter Student Results
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Select an exam, class and subject to enter
                        student marks.
                    </p>
                </div>

                {/* ==========================================
            Selection Card
        ========================================== */}

                <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm md:p-6">

                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Exam Information
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        {/* Exam */}

                        <div>
                            <label
                                htmlFor="exam"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Select Exam
                            </label>

                            <select
                                id="exam"
                                value={selectedExam}
                                onChange={(e) =>
                                    setSelectedExam(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Exam
                                </option>

                                <option value="midterm-2026">
                                    Mid Term Examination
                                </option>

                                <option value="final-2026">
                                    Final Examination
                                </option>

                                <option value="class-test-1">
                                    Class Test 1
                                </option>
                            </select>
                        </div>

                        {/* Class */}

                        <div>
                            <label
                                htmlFor="class"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Select Class
                            </label>

                            <select
                                id="class"
                                value={selectedClass}
                                onChange={(e) =>
                                    setSelectedClass(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Class
                                </option>

                                <option value="class-6">
                                    Class 6
                                </option>

                                <option value="class-7">
                                    Class 7
                                </option>

                                <option value="class-8">
                                    Class 8
                                </option>

                                <option value="class-9">
                                    Class 9
                                </option>

                                <option value="class-10">
                                    Class 10
                                </option>
                            </select>
                        </div>

                        {/* Subject */}

                        <div>
                            <label
                                htmlFor="subject"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Select Subject
                            </label>

                            <select
                                id="subject"
                                value={selectedSubject}
                                onChange={(e) =>
                                    setSelectedSubject(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Subject
                                </option>

                                <option value="bangla">
                                    Bangla
                                </option>

                                <option value="english">
                                    English
                                </option>

                                <option value="mathematics">
                                    Mathematics
                                </option>

                                <option value="science">
                                    Science
                                </option>

                                <option value="ict">
                                    ICT
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Load Students */}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleLoadStudents}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
                        >
                            Load Students
                        </button>
                    </div>
                </div>

                {/* ==========================================
            Student Marks
        ========================================== */}

                {showStudents && (
                    <div className="rounded-2xl bg-white shadow-sm">

                        {/* Table Header */}

                        <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Student Marks
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Enter marks for each student.
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                                Total Marks: {totalMarks}
                            </div>
                        </div>

                        {/* Desktop Table */}

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Roll
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Student Name
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Marks
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Result
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {marks.map((student, index) => {
                                        const studentMarks =
                                            Number(student.marks);

                                        const isPassed =
                                            student.marks !== "" &&
                                            studentMarks >= 40;

                                        return (
                                            <tr
                                                key={student.studentId}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                    {student.roll}
                                                </td>

                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                                    {student.studentName}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={totalMarks}
                                                        value={student.marks}
                                                        onChange={(e) =>
                                                            handleMarksChange(
                                                                student.studentId,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter marks"
                                                        className="w-32 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    {student.marks !== "" ? (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${isPassed
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {isPassed
                                                                ? "Passed"
                                                                : "Failed"}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            Not entered
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}

                        {/* <div className="space-y-4 p-4 md:hidden">
                            {marks.map((student, index) => {
                                const studentMarks =
                                    Number(student.marks);

                                const isPassed =
                                    student.marks !== "" &&
                                    studentMarks >= 40;

                                return (
                                    <div
                                        key={student.studentId}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Student #{index + 1}
                                                </p>

                                                <h3 className="font-semibold text-gray-800">
                                                    {student.studentName}
                                                </h3>
                                            </div>

                                            <span className="text-sm text-gray-500">
                                                Roll: {student.roll}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max={totalMarks}
                                                value={student.marks}
                                                onChange={(e) =>
                                                    handleMarksChange(
                                                        student.studentId,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter marks"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                            {student.marks !== "" && (
                                                <span
                                                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${isPassed
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {isPassed
                                                        ? "Passed"
                                                        : "Failed"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div> */}

                        {/* ==========================================
                Save Section
            ========================================== */}

                        <div className="flex flex-col gap-4 border-t p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">

                            <p className="text-sm text-gray-500">
                                {marks.length} students
                            </p>

                            <button
                                type="button"
                                onClick={handleSaveMarks}
                                disabled={saving}
                                className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Marks"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterResult;
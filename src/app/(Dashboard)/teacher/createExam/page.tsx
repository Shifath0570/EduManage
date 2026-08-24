"use client";

import React, { useState } from "react";

interface ExamFormData {
  examTitle: string;
  examType: string;
  subject: string;
  className: string;
  section: string;
  academicYear: string;
  examDate: string;
  startTime: string;
  duration: string;
  room: string;
  totalMarks: string;
  passMarks: string;
  instructions: string;
  status: "draft" | "published";
}

const initialFormData: ExamFormData = {
  examTitle: "",
  examType: "",
  subject: "",
  className: "",
  section: "",
  academicYear: "",
  examDate: "",
  startTime: "",
  duration: "",
  room: "",
  totalMarks: "",
  passMarks: "",
  instructions: "",
  status: "draft",
};

const CreateExam = () => {
  const [formData, setFormData] =
    useState<ExamFormData>(initialFormData);

  const [loading, setLoading] = useState<boolean>(false);

  // =========================================================
  // Backend API URL
  // শুধু এখানে তোমার backend URL বসাবে
  // =========================================================
  const API_URL = "YOUR_BACKEND_API_URL";

  // =========================================================
  // Handle Input Change
  // =========================================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Handle Form Submit
  // =========================================================
  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Pass marks validation
    if (
      Number(formData.passMarks) >
      Number(formData.totalMarks)
    ) {
      alert("Pass marks cannot be greater than total marks.");
      return;
    }

    try {
      setLoading(true);

      const examData = {
        examTitle: formData.examTitle,
        examType: formData.examType,
        subject: formData.subject,
        className: formData.className,
        section: formData.section,
        academicYear: Number(formData.academicYear),
        examDate: formData.examDate,
        startTime: formData.startTime,
        duration: Number(formData.duration),
        room: formData.room,
        totalMarks: Number(formData.totalMarks),
        passMarks: Number(formData.passMarks),
        instructions: formData.instructions,
        status: formData.status,
      };

      const response = await fetch(`${API_URL}/exams`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        throw new Error("Failed to create exam");
      }

      const data = await response.json();

      console.log("Exam Created Successfully:", data);

      alert("Exam created successfully!");

      // Reset form
      setFormData(initialFormData);
    } catch (error) {
      console.error("Create Exam Error:", error);

      alert(
        "Failed to create exam. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Reset Form
  // =========================================================
  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ===================================================
            Page Header
        =================================================== */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Create New Exam
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and schedule an examination for your students.
          </p>
        </div>

        {/* ===================================================
            Form
        =================================================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-5 shadow-sm md:p-8"
        >

          {/* =================================================
              Exam Information
          ================================================= */}
          <section className="mb-8">
            <h2 className="mb-5 border-b pb-3 text-lg font-semibold text-gray-800">
              Exam Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Exam Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="examTitle"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Exam Title{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="examTitle"
                  name="examTitle"
                  type="text"
                  value={formData.examTitle}
                  onChange={handleChange}
                  placeholder="e.g. Mid Term Examination"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Exam Type */}
              <div>
                <label
                  htmlFor="examType"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Exam Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="examType"
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Exam Type</option>
                  <option value="class_test">
                    Class Test
                  </option>
                  <option value="quiz">Quiz</option>
                  <option value="midterm">
                    Mid Term
                  </option>
                  <option value="final">
                    Final Exam
                  </option>
                  <option value="model_test">
                    Model Test
                  </option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Subject{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Subject</option>
                  <option value="bangla">Bangla</option>
                  <option value="english">English</option>
                  <option value="mathematics">
                    Mathematics
                  </option>
                  <option value="science">Science</option>
                  <option value="ict">ICT</option>
                </select>
              </div>

              {/* Class */}
              <div>
                <label
                  htmlFor="className"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Class{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>

              {/* Section */}
              <div>
                <label
                  htmlFor="section"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Section{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label
                  htmlFor="academicYear"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Academic Year{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="academicYear"
                  name="academicYear"
                  type="number"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2026"
                  min="2000"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              Exam Schedule
          ================================================= */}
          <section className="mb-8">
            <h2 className="mb-5 border-b pb-3 text-lg font-semibold text-gray-800">
              Exam Schedule
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {/* Exam Date */}
              <div>
                <label
                  htmlFor="examDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Exam Date{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="examDate"
                  name="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Time{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Duration (Minutes){" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="120"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Room */}
              <div>
                <label
                  htmlFor="room"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Room / Hall
                </label>

                <input
                  id="room"
                  name="room"
                  type="text"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="Room 201"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              Marks & Grading
          ================================================= */}
          <section className="mb-8">
            <h2 className="mb-5 border-b pb-3 text-lg font-semibold text-gray-800">
              Marks & Grading
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Total Marks */}
              <div>
                <label
                  htmlFor="totalMarks"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Total Marks{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Pass Marks */}
              <div>
                <label
                  htmlFor="passMarks"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pass Marks{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="passMarks"
                  name="passMarks"
                  type="number"
                  value={formData.passMarks}
                  onChange={handleChange}
                  placeholder="40"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              Instructions
          ================================================= */}
          <section className="mb-8">
            <h2 className="mb-5 border-b pb-3 text-lg font-semibold text-gray-800">
              Instructions
            </h2>

            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              placeholder="Write instructions for students..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* =================================================
              Publication
          ================================================= */}
          <section className="mb-8">
            <h2 className="mb-5 border-b pb-3 text-lg font-semibold text-gray-800">
              Publication
            </h2>

            <div className="max-w-md">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Exam Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="draft">
                  Save as Draft
                </option>

                <option value="published">
                  Publish Exam
                </option>
              </select>
            </div>
          </section>

          {/* =================================================
              Buttons
          ================================================= */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
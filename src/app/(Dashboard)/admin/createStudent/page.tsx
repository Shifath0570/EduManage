
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Card, CardHeader, Avatar, AvatarImage, AvatarFallback, Spinner } from "@heroui/react";
import { Calendar, ChevronDown, Plus, Upload } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  class: string;
  section: string;
  studentId: string;
  admissionDate: string;
  profileImage: string;
}

const initialFormData: StudentFormData = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  guardianName: "",
  guardianPhone: "",
  class: "",
  section: "",
  studentId: "",
  admissionDate: "",
  profileImage: "",
};

export default function CreateStudent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setFormData((prev) => ({ ...prev, profileImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Construct the complete payload sent to the backend endpoint
    const payload = {
      userId: user?.id,
      ...formData,
      createdBy: user?.id ?? null,
      creatorEmail: user?.email ?? null,
      metadata: {
        submittedAt: new Date().toISOString(),
      },
    };

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload)

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit student form.");
      }

      alert("Student created successfully!");
      setFormData(initialFormData);
      setAvatarPreview(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#081838]">
          Create Student
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new student to the system.
        </p>
      </div>

      <Card className="border border-slate-100 bg-white p-8 shadow-xs rounded-2xl">
        <CardHeader className="mb-6 p-0">
          <h2 className="text-lg font-bold text-[#081838]">
            Student Information
          </h2>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20 ring-2 ring-purple-500/20">
              {avatarPreview && <AvatarImage src={avatarPreview} alt="Profile preview" />}
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-xs font-semibold text-slate-600">
                Upload Profile Picture
              </span>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100">
                <Upload className="h-4 w-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Guardian Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="guardianName"
                placeholder="Enter guardian name"
                value={formData.guardianName}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Guardian Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="guardianPhone"
                placeholder="Enter guardian phone number"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select class</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                  <option value="class_3">Class 3</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Section <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select section</option>
                  <option value="a">Section A</option>
                  <option value="b">Section B</option>
                  <option value="c">Section C</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="studentId"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              className="bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={loading || isPending}
              className="bg-[#6348eb] font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-[#5238d6]"
            >
              {loading ? (
                <Spinner size="sm" color="current" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1 inline" />
                  Create Student
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}




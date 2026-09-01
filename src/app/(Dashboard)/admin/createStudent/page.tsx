
"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo } from "react";
import { Button, Card, CardHeader, Avatar, AvatarImage, AvatarFallback, Spinner } from "@heroui/react";
import { Calendar, ChevronDown, Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// NCTB Subjects Dataset structured with explicit class + stream keys
const CLASS_SUBJECTS_MAP: Record<string, string[]> = {
  class_1: ["Bangla", "English", "Mathematics"],
  class_2: ["Bangla", "English", "Mathematics"],
  class_3: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_4: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_5: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education"
  ],
  class_6: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_7: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_8: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "History and Social Science",
    "Digital Technology",
    "Wellbeing",
    "Life and Livelihood",
    "Art and Culture",
    "Religious Education"
  ],
  class_9_science: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics"
  ],
  class_9_businessStudies: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Accounting",
    "Business Entrepreneurship",
    "Finance and Banking",
    "General Science"
  ],
  class_9_humanities: [
    "Bangla",
    "English",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "History of Bangladesh and World Civilization",
    "Geography and Environment",
    "Civics and Citizenship",
    "Economics"
  ],
  class_10_science: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics"
  ],
  class_10_businessStudies: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "Accounting",
    "Business Entrepreneurship",
    "Finance and Banking",
    "General Science"
  ],
  class_10_humanities: [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "Information and Communication Technology (ICT)",
    "Religious and Moral Education",
    "History of Bangladesh and World Civilization",
    "Geography and Environment",
    "Civics and Citizenship",
    "Economics"
  ]
};

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  className: string;
  section: string;
  studentId: string;
  roll: string;
  admissionDate: string;
  profileImage: string;
  stream?: string;
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
  className: "",
  section: "",
  studentId: "",
  roll: "",
  admissionDate: "",
  profileImage: "",
  stream: "",
};

export default function CreateStudent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const router = useRouter();

  // Directly derive subjects from CLASS_SUBJECTS_MAP using className key
  const computedSubjects = useMemo(() => {
    if (!formData.className) return [];
    return CLASS_SUBJECTS_MAP[formData.className] || [];
  }, [formData.className]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-populate stream property when a class with stream is chosen
      if (name === "className") {
        if (value.includes("science")) {
          updated.stream = "science";
        } else if (value.includes("businessStudies")) {
          updated.stream = "businessStudies";
        } else if (value.includes("humanities")) {
          updated.stream = "humanities";
        } else {
          updated.stream = "";
        }
      }
      return updated;
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarPreview(localPreviewUrl);
    setUploadingImage(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("ImgBB API key is missing from environment variables.");
      }

      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: body,
      });

      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;
        setAvatarPreview(imageUrl);
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      } else {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Image upload failed.";
      alert(errorMessage);
      setAvatarPreview(formData.profileImage || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      subjects: computedSubjects,
      metadata: {
        submittedAt: new Date().toISOString(),
      },
    };

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit student form.");
      }

      alert("Student created successfully!");
      router.push("/admin/manageStudents");
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
                {uploadingImage ? (
                  <>
                    <Spinner size="sm" color="current" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
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
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select class</option>
                  <option value="class_1">Class 1</option>
                  <option value="class_2">Class 2</option>
                  <option value="class_3">Class 3</option>
                  <option value="class_4">Class 4</option>
                  <option value="class_5">Class 5</option>
                  <option value="class_6">Class 6</option>
                  <option value="class_7">Class 7</option>
                  <option value="class_8">Class 8</option>
                  <option value="class_9_science">Class 9 (Science)</option>
                  <option value="class_9_businessStudies">Class 9 (Business Studies)</option>
                  <option value="class_9_humanities">Class 9 (Humanities)</option>
                  <option value="class_10_science">Class 10 (Science)</option>
                  <option value="class_10_businessStudies">Class 10 (Business Studies)</option>
                  <option value="class_10_humanities">Class 10 (Humanities)</option>
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
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="roll"
                placeholder="Enter roll number"
                value={formData.roll}
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

          {/* Assigned Subjects Preview */}
          {computedSubjects.length > 0 && (
            <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <h3 className="text-xs font-semibold text-slate-700 mb-2">
                Auto-assigned Subjects ({computedSubjects.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {computedSubjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-lg bg-purple-50 border border-purple-200/60 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              className="bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={loading || uploadingImage}
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



"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import {
  ArrowLeft,
  Upload,
  Plus,
  ChevronDown,
  Check,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import * as XLSX from "xlsx";

interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  profilePhoto: string;
  qualifications: string;
  experienceYears: string;
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

interface ApiErrorResponse {
  message?: string;
}

export default function AddTeacherPage(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [photoName, setPhotoName] = useState<string>("");
  const [generatingAI, setGeneratingAI] = useState<boolean>(false);

  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    profilePhoto: "",
    qualifications: "",
    experienceYears: "",
    subjectSpecialization: "",
    joiningDate: "",
    employeeId: "",
    address: "",
    city: "",
    stateProvince: "",
    postCode: "",
    guardianName: "",
    guardianPhone: "",
    emergencyContact: "",
  });

  // Automatically populate name and email from session when loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ImgBB API key is missing. Check your environment variables."
      );
    }

    const data = new FormData();
    data.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: data,
      }
    );

    const resData = await response.json();

    if (!resData.success) {
      throw new Error(resData.error?.message || "Image upload failed");
    }

    return resData.data.url;
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");

      const uploadedUrl = await uploadToImgBB(file);

      setFormData((prev) => ({ ...prev, profilePhoto: uploadedUrl }));
      setPhotoName(file.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to upload image to ImgBB");
      }
    } finally {
      setUploadingPhoto(false);
    }
  };


  // AI Generate & Export Bulk Data to Excel Sheet
  const handleAIGenerateExcel = async (): Promise<void> => {
    try {
      setGeneratingAI(true);
      setError("");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/api/teachers/generate-ai-excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 10 }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Export failed.");

      const worksheet = XLSX.utils.json_to_sheet(result.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

      XLSX.writeFile(workbook, `AI_Generated_Teachers_${Date.now()}.xlsx`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to generate Excel file";
      setError(msg);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Unified Handler: Save to DB & Export Current Form Data to Excel Sheet
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Build and post payload to Database
      const rawPayload = {
        teacherId: user?.id,
        ...formData,
        experienceYears: formData.experienceYears
          ? Number(formData.experienceYears)
          : undefined,
        submittedAt: new Date().toISOString(),
        status: "Active",
      };

      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([_, v]) => v !== "" && v !== undefined
        )
      );

      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/api/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data: ApiErrorResponse = await res.json();
        throw new Error(data.message || "Failed to submit teacher record");
      }

      // 2. Generate and trigger Excel download from current Form Data
      const exportData = [
        {
          "Full Name": formData.fullName,
          Email: formData.email,
          Phone: formData.phone,
          "Date of Birth": formData.dateOfBirth,
          Gender: formData.gender,
          "Blood Group": formData.bloodGroup,
          Qualifications: formData.qualifications,
          "Experience (Years)": formData.experienceYears,
          Specialization: formData.subjectSpecialization,
          "Joining Date": formData.joiningDate,
          "Employee ID": formData.employeeId,
          Address: formData.address,
          City: formData.city,
          "State/Province": formData.stateProvince,
          "Post Code": formData.postCode,
          "Guardian Name": formData.guardianName,
          "Guardian Phone": formData.guardianPhone,
          "Emergency Contact": formData.emergencyContact,
          "Profile Photo URL": formData.profilePhoto,
          "Submitted At": new Date().toLocaleString(),
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Teacher Record");

      const fileName = `${formData.fullName.replace(/\s+/g, "_")}_Record_${Date.now()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      alert("Teacher added to database and Excel exported successfully!");
      router.push("/admin/manageTeachers");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full h-10 px-3 py-2 text-sm bg-transparent rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:outline-none transition-colors text-slate-700 placeholder:text-slate-400";

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/manageTeachers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors py-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </Link>
      </div>

      {/* Header & AI Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#081838]">
            Teacher Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add a new teacher manually or auto-generate records with AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onPress={handleAIGenerateExcel}
            isDisabled={generatingAI}
            className="bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-xs rounded-xl inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {generatingAI ? "Building Excel..." : "Export AI Data to Excel"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3.5 sm:p-4 text-xs sm:text-sm text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Personal Information Card */}
        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 bg-white rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#081838]">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Gender *
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} appearance-none pr-8`}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none pr-8`}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Profile Photo
                </label>
                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50 block relative h-24 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                  {uploadingPhoto ? (
                    <p className="text-xs font-semibold text-blue-600 animate-pulse">
                      Uploading photo...
                    </p>
                  ) : photoName ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold px-2 w-full">
                      <Check className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {photoName}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-5 w-5 text-blue-600 mb-1" />
                      <p className="text-xs font-semibold text-slate-700">
                        Upload photo
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG up to 2MB
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Qualifications *
                </label>
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Enter highest qualification"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Subject Specialization *
                </label>
                <div className="relative">
                  <select
                    name="subjectSpecialization"
                    value={formData.subjectSpecialization}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} appearance-none pr-8`}
                  >
                    <option value="" disabled>
                      Select subject specialization
                    </option>
                    <option value="Bengali Literature">Bengali Literature</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Applied Mathematics">Applied Mathematics</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Business Entrepreneurship">Business Entrepreneurship</option>
                    <option value="Finance">Finance</option>
                    <option value="General Science">General Science</option>
                    <option value="History">History</option>
                    <option value="Geography and Environment">Geography and Environment</option>
                    <option value="Political Science">Political Science</option>
                    <option value="Economics">Economics</option>
                    <option value="Science">Science</option>
                    <option value="Wellbeing">Wellbeing</option>
                    <option value="Art and Culture">Art and Culture</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  placeholder="Enter years of experience"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Joining Date *
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="Enter employee ID (optional)"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Contact & Address Information Card */}
        <Card className="p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 bg-white rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#081838]">
              Contact & Address Information
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Address *
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="stateProvince"
                  placeholder="Enter state or province"
                  value={formData.stateProvince}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Post Code *
                </label>
                <input
                  type="text"
                  name="postCode"
                  placeholder="Enter post code"
                  value={formData.postCode}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Guardian Name *
                </label>
                <input
                  type="text"
                  name="guardianName"
                  placeholder="Enter guardian name"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Guardian Phone *
                </label>
                <input
                  type="text"
                  name="guardianPhone"
                  placeholder="Enter guardian phone number"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="Enter emergency contact number"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Button
            type="button"
            onPress={() => router.back()}
            className="w-full sm:w-auto px-6 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            Cancel
          </Button>

          {/* Unified Form Submission Button */}
          <Button
            type="submit"
            isDisabled={loading || uploadingPhoto}
            className="w-full sm:w-auto px-6 font-medium text-white bg-[#5b21b6] hover:bg-[#4c1d95] inline-flex items-center justify-center gap-2"
          >
            {!loading && <Plus className="h-4 w-4" />}
            {loading ? "Saving & Exporting..." : "Add Teacher & Export Excel"}
          </Button>
        </div>
      </form>
    </div>
  );
}



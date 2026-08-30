
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { ArrowLeft, Upload, Plus, ChevronDown, Check } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

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
  const [error, setError] = useState<string>("");
  const [photoName, setPhotoName] = useState<string>("");

  const { data: session, isPending } = useSession();
  const user = session?.user
  // console.log(user)

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, profilePhoto: base64String }));
      setPhotoName(file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Structured payload containing form data and metadata
    const payload = {
      userId: user?.id,
      ...formData,
      experienceYears: formData.experienceYears
        ? Number(formData.experienceYears)
        : undefined,
      submittedAt: new Date().toISOString(),
      status: "Active",
    };

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      console.log(payload)

      if (!res.ok) {
        const data: ApiErrorResponse = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/admin/teachers");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full h-10 px-3 py-2 text-sm bg-transparent rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:outline-none transition-colors text-slate-700 placeholder:text-slate-400";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="mb-2">
        <Link
          href="/admin/manageTeachers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </Link>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#081838]">
          Teacher Information
        </h1>
        <p className="text-sm text-slate-500 mt-1">Add a new teacher to the system.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Card */}
        <Card className="p-4 sm:p-6 shadow-sm border border-slate-100 bg-white rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-[#081838]">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date of Birth */}
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

              {/* Gender */}
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
                    className={`${inputStyles} appearance-none`}
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

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none`}
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

            {/* Profile Photo & Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Profile Photo
                </label>
                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50 block relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {photoName ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <Check className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">{photoName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-6 w-6 text-blue-600 mb-1" />
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

              <div className="space-y-4">
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

                {/* Subject Specialization */}
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
                      className={`${inputStyles} appearance-none`}
                    >
                      <option value="" disabled>
                        Select subject specialization
                      </option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="English">English</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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

                {/* Joining Date */}
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div></div>
              <div></div>
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
        <Card className="p-6 shadow-sm border border-slate-100 bg-white rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-[#081838]">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onPress={() => router.back()}
            className="px-6 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isPending={loading}
            className="px-6 font-medium text-white bg-[#5b21b6] hover:bg-[#4c1d95] inline-flex items-center justify-center gap-2"
          >
            {!loading && <Plus className="h-4 w-4" />}
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
        </div>
      </form>
    </div>
  );
}




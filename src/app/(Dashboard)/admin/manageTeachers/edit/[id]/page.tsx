
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button, Card, CardHeader, Avatar, AvatarImage, AvatarFallback, Spinner } from "@heroui/react";
import { Calendar, ChevronDown, Save, Upload, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
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

const initialFormData: TeacherFormData = {
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
};

export default function EditTeacherPage(): React.ReactElement {
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>(initialFormData);

  const router = useRouter();
  const params = useParams();
  const teacherIdParam = params?.id as string;

  const { data: session } = useSession();
  const user = session?.user;

  // Fetch initial teacher details on component mount
  useEffect(() => {
    if (!teacherIdParam) return;

    const fetchTeacherData = async (): Promise<void> => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiURL}/api/teachers/${teacherIdParam}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || "Failed to fetch teacher details.");
        }

        const teacher = data.data || data;

        // Format ISO dates to YYYY-MM-DD for HTML input[type="date"]
        const formatDate = (dateString?: string) =>
          dateString ? new Date(dateString).toISOString().split("T")[0] : "";

        setFormData({
          fullName: teacher.fullName || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          dateOfBirth: formatDate(teacher.dateOfBirth),
          gender: teacher.gender || "",
          bloodGroup: teacher.bloodGroup || "",
          profilePhoto: teacher.profilePhoto || "",
          qualifications: teacher.qualifications || "",
          experienceYears: teacher.experienceYears ? String(teacher.experienceYears) : "",
          subjectSpecialization: teacher.subjectSpecialization || "",
          joiningDate: formatDate(teacher.joiningDate),
          employeeId: teacher.employeeId || "",
          address: teacher.address || "",
          city: teacher.city || "",
          stateProvince: teacher.stateProvince || "",
          postCode: teacher.postCode || "",
          guardianName: teacher.guardianName || "",
          guardianPhone: teacher.guardianPhone || "",
          emergencyContact: teacher.emergencyContact || "",
        });

        if (teacher.profilePhoto) {
          setAvatarPreview(teacher.profilePhoto);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching teacher details.";
        alert(errorMessage);
        router.push("/admin/manageTeachers");
      } finally {
        setFetching(false);
      }
    };

    fetchTeacherData();
  }, [teacherIdParam, router]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
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
        setFormData((prev) => ({ ...prev, profilePhoto: imageUrl }));
      } else {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Image upload failed.";
      alert(errorMessage);
      setAvatarPreview(formData.profilePhoto || null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      userId: user?.id,
      ...formData,
      experienceYears: formData.experienceYears
        ? Number(formData.experienceYears)
        : undefined,
      metadata: {
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/api/teachers/${teacherIdParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to update teacher details.");
      }

      alert("Teacher updated successfully!");
      router.push("/admin/manageTeachers");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20";

  return (
    <div className="mx-auto w-[90%] px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#081838]">Edit Teacher Details</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update profile and professional details for {formData.fullName || "this teacher"}.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.back()}
          className="w-fit bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      <Card className="border border-slate-100 bg-white p-8 shadow-xs rounded-2xl">
        <CardHeader className="mb-6 p-0">
          <h2 className="text-lg font-bold text-[#081838]">Update Teacher Information</h2>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20 ring-2 ring-purple-500/20">
              {avatarPreview && <AvatarImage src={avatarPreview} alt="Profile preview" />}
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-xs font-semibold text-slate-600">Change Profile Picture</span>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100">
                {uploadingImage ? (
                  <>
                    <Spinner size="sm" color="current" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose New Image
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

          {/* Personal Information Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                className={inputStyles}
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
                className={inputStyles}
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
                  className={inputStyles}
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
                  className={`${inputStyles} appearance-none`}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Blood Group</label>
              <div className="relative">
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="qualifications"
                placeholder="Enter highest qualification"
                value={formData.qualifications}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Subject Specialization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="subjectSpecialization"
                  value={formData.subjectSpecialization}
                  onChange={handleInputChange}
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                placeholder="Enter years of experience"
                value={formData.experienceYears}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className={inputStyles}
                />
                <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                placeholder="Enter employee ID (optional)"
                value={formData.employeeId}
                onChange={handleInputChange}
                className={inputStyles}
              />
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
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="stateProvince"
                placeholder="Enter state or province"
                value={formData.stateProvince}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Post Code <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="postCode"
                placeholder="Enter post code"
                value={formData.postCode}
                onChange={handleInputChange}
                className={inputStyles}
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
                className={inputStyles}
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
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="Enter emergency contact number"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => router.push("/admin/manageTeachers")}
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
                  <Save className="mr-1 inline h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}





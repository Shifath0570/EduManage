
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import { Save, ChevronDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";

interface AssignFormData {
  classId: string;
  sectionId: string;
  subjectId: string;
  academicYear: string;
}

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

const AssingSSC = () => {
  const router = useRouter();
  const params = useParams();
  const teacherIdParam = params?.id as string;


  const { data: session } = useSession();
  const user = session?.user;

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<AssignFormData>({
    classId: "",
    sectionId: "",
    subjectId: "",
    academicYear: new Date().getFullYear().toString(),
  });

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If the user changes the class, reset the selected subject back to empty
      if (name === "classId") {
        return {
          ...prev,
          classId: value,
          subjectId: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
          teacherId: teacherIdParam,
          assignedBy: user?.id,
          ...formData,
        }

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiURL}/api/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to assign teacher.");
      }

      alert("Teacher assigned successfully!");
      // router.push(`/admin/manageTeachers/assing/${teacherIdParam}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Assignment failed.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyles =
    "w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20";

  // Get dynamic array of subjects based on selected classId key
  const availableSubjects = formData.classId ? CLASS_SUBJECTS_MAP[formData.classId] || [] : [];

  return (
    <div className="mx-auto w-[90%] px-6">
      <Card className="border border-slate-100 bg-white p-8 shadow-xs rounded-2xl">
        <h2 className="mb-6 text-lg font-bold text-[#081838]">Assign Class & Subject</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Select Class */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className={selectStyles}
                >
                  <option value="" disabled>
                    Select Class
                  </option>
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

            {/* Select Section */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Section <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleInputChange}
                  className={selectStyles}
                >
                  <option value="" disabled>
                    Select Section
                  </option>
                  <option value="sec-a">Section A</option>
                  <option value="sec-b">Section B</option>
                  <option value="sec-c">Section C</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Select Subject (Populated dynamically based on chosen class) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  disabled={!formData.classId}
                  className={`${selectStyles} ${
                    !formData.classId ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <option value="" disabled>
                    {formData.classId ? "Select Subject" : "First Select Class"}
                  </option>
                  {availableSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Academic Year */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

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
              isDisabled={submitting}
              className="bg-[#6348eb] font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-[#5238d6]"
            >
              {submitting ? (
                <Spinner size="sm" color="current" />
              ) : (
                <>
                  <Save className="mr-1 inline h-4 w-4" /> Assign
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssingSSC;









// "use client";

// import React, { useState, ChangeEvent, FormEvent, useMemo, useEffect } from "react";
// import { Button, Card, CardHeader, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";
// import { ChevronDown, FileSpreadsheet, Upload } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useSession } from "@/app/lib/auth-client";
// import * as XLSX from "xlsx";

// const CLASS_SUBJECTS_MAP: Record<string, string[]> = {
//   class_1: ["Bangla", "English", "Mathematics"],
//   class_2: ["Bangla", "English", "Mathematics"],
//   class_3: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Elementary Science",
//     "Bangladesh and Global Studies",
//     "Religious and Moral Education",
//   ],
//   class_4: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Elementary Science",
//     "Bangladesh and Global Studies",
//     "Religious and Moral Education",
//   ],
//   class_5: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Elementary Science",
//     "Bangladesh and Global Studies",
//     "Religious and Moral Education",
//   ],
//   class_6: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Science",
//     "History and Social Science",
//     "Digital Technology",
//     "Wellbeing",
//     "Life and Livelihood",
//     "Art and Culture",
//     "Religious Education",
//   ],
//   class_7: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Science",
//     "History and Social Science",
//     "Digital Technology",
//     "Wellbeing",
//     "Life and Livelihood",
//     "Art and Culture",
//     "Religious Education",
//   ],
//   class_8: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Science",
//     "History and Social Science",
//     "Digital Technology",
//     "Wellbeing",
//     "Life and Livelihood",
//     "Art and Culture",
//     "Religious Education",
//   ],
//   class_9_science: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "Higher Mathematics",
//   ],
//   class_9_businessStudies: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "Accounting",
//     "Business Entrepreneurship",
//     "Finance and Banking",
//     "General Science",
//   ],
//   class_9_humanities: [
//     "Bangla",
//     "English",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "History of Bangladesh and World Civilization",
//     "Geography and Environment",
//     "Civics and Citizenship",
//     "Economics",
//   ],
//   class_10_science: [
//     "Bangla 1st Paper",
//     "Bangla 2nd Paper",
//     "English 1st Paper",
//     "English 2nd Paper",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "Higher Mathematics",
//   ],
//   class_10_businessStudies: [
//     "Bangla 1st Paper",
//     "Bangla 2nd Paper",
//     "English 1st Paper",
//     "English 2nd Paper",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "Accounting",
//     "Business Entrepreneurship",
//     "Finance and Banking",
//     "General Science",
//   ],
//   class_10_humanities: [
//     "Bangla 1st Paper",
//     "Bangla 2nd Paper",
//     "English 1st Paper",
//     "English 2nd Paper",
//     "Mathematics",
//     "Information and Communication Technology (ICT)",
//     "Religious and Moral Education",
//     "History of Bangladesh and World Civilization",
//     "Geography and Environment",
//     "Civics and Citizenship",
//     "Economics",
//   ],
// };

// interface StudentFormData {
//   name: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   address: string;
//   guardianName: string;
//   guardianPhone: string;
//   className: string;
//   section: string;
//   studentId: string;
//   roll: string;
//   admissionDate: string;
//   profileImage: string;
//   stream?: string;
// }

// interface StudentPayload extends StudentFormData {
//   stuId?: string;
//   subjects: string[];
//   metadata: {
//     submittedAt: string;
//   };
// }

// const initialFormData: StudentFormData = {
//   name: "",
//   email: "",
//   phone: "",
//   dateOfBirth: "",
//   gender: "",
//   address: "",
//   guardianName: "",
//   guardianPhone: "",
//   className: "",
//   section: "",
//   studentId: "",
//   roll: "",
//   admissionDate: "",
//   profileImage: "",
//   stream: "",
// };

// export default function CreateStudent() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [generatingAi, setGeneratingAi] = useState<boolean>(false);
//   const [uploadingImage, setUploadingImage] = useState<boolean>(false);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [formData, setFormData] = useState<StudentFormData>(initialFormData);
//   const router = useRouter();

//   const { data: session } = useSession();
//   const user = session?.user;

//   useEffect(() => {
//     if (user) {
//       setFormData((prev: StudentFormData): StudentFormData => ({
//         ...prev,
//         name: prev.name || user.name || "",
//         email: prev.email || user.email || "",
//       }));
//     }
//   }, [user]);

//   const isGroupRequired = useMemo<boolean>(() => {
//     return formData.className === "class_9" || formData.className === "class_10";
//   }, [formData.className]);

//   const computedSubjects = useMemo<string[]>(() => {
//     if (!formData.className) return [];

//     if (isGroupRequired) {
//       if (!formData.stream) return [];
//       const classKey = `${formData.className}_${formData.stream}`;
//       return CLASS_SUBJECTS_MAP[classKey] || [];
//     }

//     return CLASS_SUBJECTS_MAP[formData.className] || [];
//   }, [formData.className, formData.stream, isGroupRequired]);

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev: StudentFormData): StudentFormData => {
//       const updated: StudentFormData = { ...prev, [name]: value };

//       if (name === "className" && value !== "class_9" && value !== "class_10") {
//         updated.stream = "";
//       }

//       return updated;
//     });
//   };

//   const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const localPreviewUrl = URL.createObjectURL(file);
//     setAvatarPreview(localPreviewUrl);
//     setUploadingImage(true);

//     try {
//       const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
//       if (!apiKey) {
//         throw new Error("ImgBB API key is missing from environment variables.");
//       }

//       const body = new FormData();
//       body.append("image", file);

//       const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//         method: "POST",
//         body,
//       });

//       const data = await res.json();

//       if (data.success) {
//         const imageUrl: string = data.data.url;
//         setAvatarPreview(imageUrl);
//         setFormData((prev: StudentFormData): StudentFormData => ({
//           ...prev,
//           profileImage: imageUrl,
//         }));
//       } else {
//         throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Image upload failed.";
//       alert(errorMessage);
//       setAvatarPreview(formData.profileImage || null);
//     } finally {
//       URL.revokeObjectURL(localPreviewUrl);
//       setUploadingImage(false);
//     }
//   };

//   const handleCancel = () => {
//     router.push("/admin/manageStudents");
//   };

//   const exportToExcel = (payload: StudentPayload) => {
//     const excelData = [
//       {
//         "Student ID": payload.studentId,
//         "Full Name": payload.name,
//         "Email": payload.email,
//         "Phone": payload.phone,
//         "Class": payload.className,
//         "Section": payload.section,
//         "Roll": payload.roll,
//         "Gender": payload.gender,
//         "Date of Birth": payload.dateOfBirth,
//         "Admission Date": payload.admissionDate,
//         "Address": payload.address,
//         "Guardian Name": payload.guardianName,
//         "Guardian Phone": payload.guardianPhone,
//         "Assigned Subjects": payload.subjects.join(", "),
//         "Profile Image": payload.profileImage || "N/A",
//       },
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Student Record");

//     XLSX.writeFile(
//       workbook,
//       `Student_${payload.studentId || "Record"}_${Date.now()}.xlsx`
//     );
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (isGroupRequired && !formData.stream) {
//       alert("Please select a group for Class 9/10.");
//       return;
//     }

//     setLoading(true);

//     const fullClassName = isGroupRequired
//       ? `${formData.className}_${formData.stream}`
//       : formData.className;

//     const payload: StudentPayload = {
//       stuId: user?.id,
//       ...formData,
//       className: fullClassName,
//       subjects: computedSubjects,
//       metadata: {
//         submittedAt: new Date().toISOString(),
//       },
//     };

//     try {
//       const apiURL = process.env.NEXT_PUBLIC_API_URL;
//       const res = await fetch(`${apiURL}/api/students`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to submit student form.");
//       }

//       exportToExcel(payload);
//       alert("Student created and Excel file downloaded successfully!");
//       router.push("/admin/manageStudents");
//       setFormData(initialFormData);
//       setAvatarPreview(null);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unexpected error occurred.";
//       alert(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAiExcelGenerate = async () => {
//     if (!formData.className) {
//       alert("Please select a class first to generate AI batch data.");
//       return;
//     }

//     setGeneratingAi(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/students/generate-excel`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             count: 10,
//             className: formData.className,
//           }),
//         }
//       );

//       if (!response.ok) throw new Error("Generation failed");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `AI_Students_${formData.className}_${Date.now()}.xlsx`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert("Failed to generate AI Excel sheet");
//     } finally {
//       setGeneratingAi(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-[90%] px-6 py-10 max-w-7xl">
//       <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-extrabold text-[#081838] sm:text-3xl">
//             Create Student
//           </h1>
//           <p className="mt-1 text-xs text-slate-500 sm:text-sm">
//             Add a new student to the system and download the Excel record.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleAiExcelGenerate}
//           disabled={generatingAi}
//           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-700 shadow-md transition disabled:opacity-50 text-xs sm:text-sm"
//         >
//           <FileSpreadsheet className="h-4 w-4" />
//           {generatingAi ? "Generating Excel with AI..." : "Spark AI Data to Excel"}
//         </button>
//       </div>

//       <Card className="border border-slate-100 bg-white p-4 shadow-sm rounded-2xl sm:p-6 md:p-8">
//         <CardHeader className="mb-4 sm:mb-6 p-0">
//           <h2 className="text-base font-bold text-[#081838] sm:text-lg">
//             Student Information
//           </h2>
//         </CardHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-start">
//             <Avatar className="h-20 w-20 ring-2 ring-purple-500/20 shrink-0">
//               {avatarPreview && <AvatarImage src={avatarPreview} alt="Profile preview" />}
//               <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
//                 ST
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col items-center gap-2 sm:items-start">
//               <span className="text-xs font-semibold text-slate-600">
//                 Upload Profile Picture
//               </span>
//               <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100 active:bg-purple-200">
//                 {uploadingImage ? (
//                   <span>Uploading...</span>
//                 ) : (
//                   <>
//                     <Upload className="h-4 w-4" />
//                     Choose Image
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={uploadingImage}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Phone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="tel"
//                 name="phone"
//                 placeholder="Enter phone number"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Date of Birth <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   required
//                   type="date"
//                   name="dateOfBirth"
//                   value={formData.dateOfBirth}
//                   onChange={handleInputChange}
//                   className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 [color-scheme:light]"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Gender <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <select
//                   required
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="" disabled>Select gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
//               <label className="text-xs font-semibold text-slate-700">
//                 Address <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="address"
//                 placeholder="Enter full address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Guardian Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="guardianName"
//                 placeholder="Enter guardian name"
//                 value={formData.guardianName}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Guardian Phone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="tel"
//                 name="guardianPhone"
//                 placeholder="Enter guardian phone number"
//                 value={formData.guardianPhone}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Class <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <select
//                   required
//                   name="className"
//                   value={formData.className}
//                   onChange={handleInputChange}
//                   className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="" disabled>Select class</option>
//                   <option value="class_1">Class 1</option>
//                   <option value="class_2">Class 2</option>
//                   <option value="class_3">Class 3</option>
//                   <option value="class_4">Class 4</option>
//                   <option value="class_5">Class 5</option>
//                   <option value="class_6">Class 6</option>
//                   <option value="class_7">Class 7</option>
//                   <option value="class_8">Class 8</option>
//                   <option value="class_9">Class 9</option>
//                   <option value="class_10">Class 10</option>
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             {isGroupRequired && (
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   Group / Stream <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     required
//                     name="stream"
//                     value={formData.stream || ""}
//                     onChange={handleInputChange}
//                     className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//                   >
//                     <option value="" disabled>Select group</option>
//                     <option value="science">Science</option>
//                     <option value="businessStudies">Business Studies</option>
//                     <option value="humanities">Humanities</option>
//                   </select>
//                   <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 </div>
//               </div>
//             )}

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Section <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <select
//                   required
//                   name="section"
//                   value={formData.section}
//                   onChange={handleInputChange}
//                   className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="" disabled>Select section</option>
//                   <option value="a">Section A</option>
//                   <option value="b">Section B</option>
//                   <option value="c">Section C</option>
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Student ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="studentId"
//                 placeholder="Enter student ID"
//                 value={formData.studentId}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Roll Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="roll"
//                 placeholder="Enter roll number"
//                 value={formData.roll}
//                 onChange={handleInputChange}
//                 className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold text-slate-700">
//                 Admission Date <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   required
//                   type="date"
//                   name="admissionDate"
//                   value={formData.admissionDate}
//                   onChange={handleInputChange}
//                   className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 [color-scheme:light]"
//                 />
//               </div>
//             </div>
//           </div>

//           {computedSubjects.length > 0 && (
//             <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 sm:p-4">
//               <h3 className="mb-2 text-xs font-semibold text-slate-700">
//                 Auto-assigned Subjects ({computedSubjects.length})
//               </h3>
//               <div className="flex flex-wrap gap-1.5">
//                 {computedSubjects.map((subject, idx) => (
//                   <span
//                     key={idx}
//                     className="inline-block rounded-lg border border-purple-200/60 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
//                   >
//                     {subject}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-8 flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row sm:items-center">
//             <Button
//               type="button"
//               onClick={handleCancel}
//               className="w-full bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200 sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               isDisabled={loading || uploadingImage}
//               className="w-full bg-[#6348eb] font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-[#5238d6] sm:w-auto inline-flex items-center gap-2"
//             >
//               <FileSpreadsheet className="h-4 w-4" />
//               {loading ? "Saving & Generating..." : "Create Student & Export Excel"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


"use client";

import React, { useState, ChangeEvent, FormEvent, useMemo, useEffect } from "react";
import { Button, Card, CardHeader, Avatar, AvatarImage, AvatarFallback } from "@heroui/react";
import { ChevronDown, FileSpreadsheet, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import * as XLSX from "xlsx";

const CLASS_SUBJECTS_MAP: Record<string, string[]> = {
  class_1: ["Bangla", "English", "Mathematics"],
  class_2: ["Bangla", "English", "Mathematics"],
  class_3: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education",
  ],
  class_4: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education",
  ],
  class_5: [
    "Bangla",
    "English",
    "Mathematics",
    "Elementary Science",
    "Bangladesh and Global Studies",
    "Religious and Moral Education",
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
    "Religious Education",
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
    "Religious Education",
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
    "Religious Education",
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
    "Higher Mathematics",
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
    "General Science",
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
    "Economics",
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
    "Higher Mathematics",
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
    "General Science",
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
    "Economics",
  ],
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

interface StudentPayload extends StudentFormData {
  stuId?: string;
  subjects: string[];
  metadata: {
    submittedAt: string;
  };
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
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

 useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const isGroupRequired = useMemo<boolean>(() => {
    return formData.className === "class_9" || formData.className === "class_10";
  }, [formData.className]);

  const computedSubjects = useMemo<string[]>(() => {
    if (!formData.className) return [];

    if (isGroupRequired) {
      if (!formData.stream) return [];
      const classKey = `${formData.className}_${formData.stream}`;
      return CLASS_SUBJECTS_MAP[classKey] || [];
    }

    return CLASS_SUBJECTS_MAP[formData.className] || [];
  }, [formData.className, formData.stream, isGroupRequired]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: StudentFormData): StudentFormData => {
      const updated: StudentFormData = { ...prev, [name]: value };

      if (name === "className" && value !== "class_9" && value !== "class_10") {
        updated.stream = "";
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
        body,
      });

      const data = await res.json();

      if (data.success) {
        const imageUrl: string = data.data.url;
        setAvatarPreview(imageUrl);
        setFormData((prev: StudentFormData): StudentFormData => ({
          ...prev,
          profileImage: imageUrl,
        }));
      } else {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Image upload failed.";
      alert(errorMessage);
      setAvatarPreview(formData.profileImage || null);
    } finally {
      URL.revokeObjectURL(localPreviewUrl);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/manageStudents");
  };

  const exportToExcel = (payload: StudentPayload) => {
    const excelData = [
      {
        "Student ID": payload.studentId,
        "Full Name": payload.name,
        "Email": payload.email,
        "Phone": payload.phone,
        "Class": payload.className,
        "Section": payload.section,
        "Roll": payload.roll,
        "Gender": payload.gender,
        "Date of Birth": payload.dateOfBirth,
        "Admission Date": payload.admissionDate,
        "Address": payload.address,
        "Guardian Name": payload.guardianName,
        "Guardian Phone": payload.guardianPhone,
        "Assigned Subjects": payload.subjects.join(", "),
        "Profile Image": payload.profileImage || "N/A",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Record");

    XLSX.writeFile(
      workbook,
      `Student_${payload.studentId || "Record"}_${Date.now()}.xlsx`
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isGroupRequired && !formData.stream) {
      alert("Please select a group for Class 9/10.");
      return;
    }

    setLoading(true);

    const fullClassName = isGroupRequired
      ? `${formData.className}_${formData.stream}`
      : formData.className;

    const payload: StudentPayload = {
      stuId: user?.id,
      ...formData,
      className: fullClassName,
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

      exportToExcel(payload);
      alert("Student created and Excel file downloaded successfully!");
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

  const handleAiExcelGenerate = async () => {
    if (!formData.className) {
      alert("Please select a class first to generate AI batch data.");
      return;
    }

    setGeneratingAi(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students/generate-excel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            count: 10,
            className: formData.className,
          }),
        }
      );

      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI_Students_${formData.className}_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate AI Excel sheet");
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="mx-auto w-[90%] px-6 py-10 max-w-7xl">
      <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#081838] sm:text-3xl">
            Create Student
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Add a new student to the system and download the Excel record.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAiExcelGenerate}
          isDisabled={generatingAi}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-700 shadow-md transition text-xs sm:text-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          {generatingAi ? "Generating Excel with AI..." : "Spark AI Data to Excel"}
        </Button>
      </div>

      <Card className="border border-slate-100 bg-white p-4 shadow-sm rounded-2xl sm:p-6 md:p-8">
        <CardHeader className="mb-4 sm:mb-6 p-0">
          <h2 className="text-base font-bold text-[#081838] sm:text-lg">
            Student Information
          </h2>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-start">
            <Avatar className="h-20 w-20 ring-2 ring-purple-500/20 shrink-0">
              {avatarPreview && <AvatarImage src={avatarPreview} alt="Profile preview" />}
              <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                ST
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-xs font-semibold text-slate-600">
                Upload Profile Picture
              </span>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100 active:bg-purple-200">
                {uploadingImage ? (
                  <span>Uploading...</span>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
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
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 [color-scheme:light]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
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

            <div className="flex flex-col gap-1.5">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Guardian Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                name="guardianPhone"
                placeholder="Enter guardian phone number"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
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
                  <option value="class_9">Class 9</option>
                  <option value="class_10">Class 10</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {isGroupRequired && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Group / Stream <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    name="stream"
                    value={formData.stream || ""}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="" disabled>Select group</option>
                    <option value="science">Science</option>
                    <option value="businessStudies">Business Studies</option>
                    <option value="humanities">Humanities</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Section <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-10 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="" disabled>Select section</option>
                  <option value="a">Section A</option>
                  <option value="b">Section B</option>
                  <option value="c">Section C</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
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

            <div className="flex flex-col gap-1.5">
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

            <div className="flex flex-col gap-1.5">
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
                  className="w-full rounded-xl bg-slate-50/70 border border-slate-200/60 pl-4 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 [color-scheme:light]"
                />
              </div>
            </div>
          </div>

          {computedSubjects.length > 0 && (
            <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 sm:p-4">
              <h3 className="mb-2 text-xs font-semibold text-slate-700">
                Auto-assigned Subjects ({computedSubjects.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {computedSubjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-lg border border-purple-200/60 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row sm:items-center">
            <Button
              type="button"
              onClick={handleCancel}
              className="w-full bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={loading || uploadingImage}
              className="w-full bg-[#6348eb] font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-[#5238d6] sm:w-auto inline-flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {loading ? "Saving & Generating..." : "Create Student & Export Excel"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}



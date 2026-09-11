
// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Shield, BookOpen, Eye, EyeOff } from "lucide-react";
// import { Button } from "@heroui/react";
// import { signUp } from "@/app/lib/auth-client";

// interface TeacherSignUpPayload {
//   name: string;
//   email: string;
//   password: string;
//   role: "teacher";
// }

// export default function SignUpPage(): React.JSX.Element {
//   const router = useRouter();
  
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");

//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     setError("");

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload: TeacherSignUpPayload = {
//         name,
//         email,
//         password,
//         role: "teacher",
//       };

//       const res = await signUp.email(payload);

//       if (res?.error) {
//         setError(res.error.message || "Failed to create account.");
//       } else {
//         router.push("/admin/createTeacher");
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unexpected error occurred.";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
//       <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
//         {/* Header */}
//         <div className="text-center">
//           <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
//             <Shield className="absolute h-9 w-9 fill-blue-500 text-blue-400" />
//             <BookOpen className="relative z-10 h-5 w-5 stroke-[2.5] text-white" />
//           </div>
//           <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">
//             Create Teacher Account
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Join the EduManage platform as an instructor
//           </p>
//         </div>

//         {/* Error Feedback */}
//         {error && (
//           <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           {/* Full Name */}
//           <div>
//             <label 
//               htmlFor="fullName" 
//               className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600"
//             >
//               Full Name
//             </label>
//             <input
//               id="fullName"
//               type="text"
//               required
//               value={name}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
//               placeholder="Jane Doe"
//               className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//             />
//           </div>

//           {/* Email Address */}
//           <div>
//             <label 
//               htmlFor="email" 
//               className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600"
//             >
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//               placeholder="name@school.edu"
//               className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label 
//               htmlFor="password" 
//               className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                 placeholder="Minimum 8 characters"
//                 className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label 
//               htmlFor="confirmPassword" 
//               className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600"
//             >
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 required
//                 value={confirmPassword}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
//                 placeholder="Re-enter password"
//                 className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//               >
//                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             isDisabled={loading}
//             className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
//           >
//             {loading ? "Creating account..." : "Sign Up as Teacher"}
//           </Button>
//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@heroui/react";
import { signUp } from "@/app/lib/auth-client";

interface TeacherSignUpPayload {
  name: string;
  email: string;
  password: string;
  role: "teacher";
}

export default function SignUpPage(): React.JSX.Element {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload: TeacherSignUpPayload = {
        name,
        email,
        password,
        role: "teacher",
      };

      const res = await signUp.email(payload);

      if (res?.error) {
        setError(res.error.message || "Failed to create account.");
      } else {
        router.push("/admin/createTeacher");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
            <Shield className="absolute h-10 w-10 fill-emerald-400/30 text-emerald-300" />
            <BookOpen className="relative z-10 h-6 w-6 stroke-[2.5] text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Create Teacher Account
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Join the EduManage platform as an instructor
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3.5 text-center text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isDisabled={loading}
            className="w-full rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up as Teacher"}
          </Button>
        </form>
      </div>
    </main>
  );
}




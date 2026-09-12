// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { GraduationCap, Eye, EyeOff } from "lucide-react";
// import { signUp } from "@/app/lib/auth-client";
// import { Button } from "@heroui/react";

// // Define strict types for the authentication API payload and response
// interface SignUpPayload {
//     name: string;
//     email: string;
//     password: string;
//     role: "student" | "teacher" | "admin";
// }

// interface AuthError {
//     message?: string;
//     code?: string;
// }

// interface SignUpResponse {
//     data?: unknown;
//     error?: AuthError | null;
// }

// export default function StudentSignUpPage(): React.ReactElement {
//     const router = useRouter();

//     // Explicitly typed state definitions
//     const [name, setName] = useState<string>("");
//     const [email, setEmail] = useState<string>("");
//     const [password, setPassword] = useState<string>("");
//     const [confirmPassword, setConfirmPassword] = useState<string>("");

//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string>("");

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//         e.preventDefault();
//         setError("");

//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const payload: SignUpPayload = {
//                 name,
//                 email,
//                 password,
//                 role: "student",
//             };

//             const res = (await signUp.email(payload)) as SignUpResponse | undefined;

//             if (res?.error) {
//                 setError(res.error.message || "Failed to create account.");
//             } else {
//                 router.push("/admin/createStudent");
//             }
//         } catch (err: unknown) {
//             const errorMessage =
//                 err instanceof Error ? err.message : "An unexpected error occurred.";
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (
//         setter: React.Dispatch<React.SetStateAction<string>>
//     ) => (e: React.ChangeEvent<HTMLInputElement>): void => {
//         setter(e.target.value);
//     };

//     return (
//         <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
//             <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
//                 {/* Header */}
//                 <div className="text-center">
//                     <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
//                         <GraduationCap className="h-7 w-7 text-blue-400 relative z-10" />
//                     </div>
//                     <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">
//                         Create Student Account
//                     </h1>
//                     <p className="mt-1 text-sm text-slate-500">
//                         Join the EduManage platform to access your courses
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//                     {/* Full Name */}
//                     <div>
//                         <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
//                             Full Name
//                         </label>
//                         <input
//                             type="text"
//                             required
//                             value={name}
//                             onChange={handleInputChange(setName)}
//                             placeholder="John Smith"
//                             className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//                         />
//                     </div>

//                     {/* Email Address */}
//                     <div>
//                         <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
//                             Email Address
//                         </label>
//                         <input
//                             type="email"
//                             required
//                             value={email}
//                             onChange={handleInputChange(setEmail)}
//                             placeholder="student@school.edu"
//                             className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//                         />
//                     </div>

//                     {/* Password */}
//                     <div>
//                         <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
//                             Password
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 required
//                                 value={password}
//                                 onChange={handleInputChange(setPassword)}
//                                 placeholder="Minimum 8 characters"
//                                 className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={(): void => setShowPassword((prev) => !prev)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
//                                 aria-label={showPassword ? "Hide password" : "Show password"}
//                             >
//                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Confirm Password */}
//                     <div>
//                         <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
//                             Confirm Password
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 required
//                                 value={confirmPassword}
//                                 onChange={handleInputChange(setConfirmPassword)}
//                                 placeholder="Re-enter password"
//                                 className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={(): void => setShowConfirmPassword((prev) => !prev)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
//                                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                             >
//                                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <Button
//                         type="submit"
//                         isDisabled={loading}
//                         className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
//                     >
//                         {loading ? "Creating account..." : "Sign Up as Student"}
//                     </Button>
//                 </form>
//             </div>
//         </main>
//     );
// }

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { signUp } from "@/app/lib/auth-client";
import { Button } from "@heroui/react";

// Define strict types for the authentication API payload and response
interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
}

interface AuthError {
  message?: string;
  code?: string;
}

interface SignUpResponse {
  data?: unknown;
  error?: AuthError | null;
}

export default function StudentSignUpPage(): React.ReactElement {
  const router = useRouter();

  // Explicitly typed state definitions
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload: SignUpPayload = {
        name,
        email,
        password,
        role: "student",
      };

      const res = (await signUp.email(payload)) as SignUpResponse | undefined;

      if (res?.error) {
        setError(res.error.message || "Failed to create account.");
      } else {
        router.push("/admin/createStudent");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setter(e.target.value);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
            <GraduationCap className="h-6 w-6 stroke-[2.2]" />
            <Sparkles className="absolute -top-1 -left-1 h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Create Student Account
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Join the EduManage platform to access your courses
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3.5 text-center text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleInputChange(setName)}
              placeholder="John Smith"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="student@school.edu"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="button"
                onClick={(): void => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                placeholder="Re-enter password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="button"
                onClick={(): void => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isDisabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Creating account..." : "Sign Up as Student"}</span>
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}



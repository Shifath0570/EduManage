// "use client";

// import React, { useState } from "react";

// import Link from "next/link";

// import { useRouter } from "next/navigation";

// import { Shield, BookOpen, Eye, EyeOff } from "lucide-react";
// import { signIn } from "@/app/lib/auth-client";

// export default function LoginPage() {

//   const router = useRouter();

//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const { data, error: authError } = await signIn.email({
//       email,
//       password,
//     });

//     console.log(data, authError)

//     if (authError) {
//       // 401 returns an error object here
//       setError(authError.message || "Invalid email or password.");
//       setLoading(false);
//       return;
//     }

//     router.push("/");
//     router.refresh(); // Recommended to force Next.js server context to update with session cookies
//   };

//   return (

//     <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">

//       <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

//         {/* EduManage Logo & Header */}

//         <div className="text-center">

//           <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">

//             <Shield className="h-9 w-9 text-blue-400 fill-blue-500 absolute" />

//             <BookOpen className="h-5 w-5 text-white relative z-10 stroke-[2.5]" />

//           </div>

//           <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">

//             Welcome back

//           </h1>

//           <p className="mt-1 text-sm text-slate-500">

//             Enter your credentials to access your EduManage account

//           </p>

//         </div>



//         {error && (

//           <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">

//             {error}

//           </div>

//         )}



//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">

//           {/* Email Address */}

//           <div>

//             <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">

//               Email Address

//             </label>

//             <input

//               type="email"

//               required

//               value={email}

//               onChange={(e) => setEmail(e.target.value)}

//               placeholder="name@school.edu"

//               className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"

//             />

//           </div>



//           {/* Password with Eye Toggle */}

//           <div>

//             <div className="mb-1 flex items-center justify-between">

//               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">

//                 Password

//               </label>

//               <Link

//                 href="/forgot-password"

//                 className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"

//               >

//                 Forgot?

//               </Link>

//             </div>

//             <div className="relative">

//               <input

//                 type={showPassword ? "text" : "password"}

//                 required

//                 value={password}

//                 onChange={(e) => setPassword(e.target.value)}

//                 placeholder="••••••••"

//                 className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"

//               />

//               <button

//                 type="button"

//                 onClick={() => setShowPassword(!showPassword)}

//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"

//                 aria-label={showPassword ? "Hide password" : "Show password"}

//               >

//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

//               </button>

//             </div>

//           </div>



//           <button

//             type="submit"

//             disabled={loading}

//             className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>

//     </main>

//   );

// }


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { signIn } from "@/app/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signIn.email({
      email,
      password,
    });

    console.log(data, authError);

    if (authError) {
      setError(authError.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        {/* EduManage Logo & Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
            <BookOpen className="h-6 w-6 stroke-[2.2]" />
            <Sparkles className="absolute -top-1 -left-1 h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Enter your credentials to access your EduManage account
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3.5 text-center text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}


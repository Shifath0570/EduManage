
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, BookOpen, Eye, EyeOff } from "lucide-react";
import { signUp } from "@/app/lib/auth-client";


export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Fixed role payload for teachers
      const res = await signUp.email({ name, email, password, role: "teacher" } as any);
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
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* EduManage Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
            <Shield className="h-9 w-9 text-blue-400 fill-blue-500 absolute" />
            <BookOpen className="h-5 w-5 text-white relative z-10 stroke-[2.5]" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">
            Create Teacher Account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join the EduManage platform as an instructor
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/Login"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            Log in
          </Link>
        </p> */}
      </div>
    </main>
  );
}





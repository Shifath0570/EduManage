
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, BookOpen, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/app/lib/auth-client";

interface AuthResponse {
  error?: {
    message?: string;
  };
  data?: unknown;
}

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = (await signIn.email({ email, password })) as AuthResponse | undefined;

      if (res?.error) {
        setError(res.error.message || "Invalid credentials.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* EduManage Logo & Header */}
        <div className="text-center">
          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
            <Shield className="absolute h-9 w-9 fill-blue-500 text-blue-400" />
            <BookOpen className="relative z-10 h-5 w-5 stroke-[2.5] text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your credentials to access your EduManage account
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email Address */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              {/* <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                Forgot?
              </Link> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}




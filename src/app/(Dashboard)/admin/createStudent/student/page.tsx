"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
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
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#03204c] text-white shadow-md">
                        <GraduationCap className="h-7 w-7 text-blue-400 relative z-10" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#03204c]">
                        Create Student Account
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Join the EduManage platform to access your courses
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
                            onChange={handleInputChange(setName)}
                            placeholder="John Smith"
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
                            onChange={handleInputChange(setEmail)}
                            placeholder="student@school.edu"
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
                                onChange={handleInputChange(setPassword)}
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
                            />
                            <button
                                type="button"
                                onClick={(): void => setShowPassword((prev) => !prev)}
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
                                onChange={handleInputChange(setConfirmPassword)}
                                placeholder="Re-enter password"
                                className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#03204c] focus:outline-none focus:ring-2 focus:ring-[#03204c]/20"
                            />
                            <button
                                type="button"
                                onClick={(): void => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
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
                        className="w-full rounded-xl bg-[#03204c] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#021838] active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign Up as Student"}
                    </Button>
                </form>
            </div>
        </main>
    );
}

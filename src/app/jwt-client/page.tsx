"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function JwtClientPage() {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadToken = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/token", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "You must be signed in to retrieve a JWT.");
            }

            setToken(result.token);
        } catch (requestError) {
            setToken("");
            setError(requestError instanceof Error ? requestError.message : "Unable to retrieve a JWT.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadToken();
    }, []);
//<RefreshCw className={"h-4 w-4 ${loading ? "animate-spin" : "}} />
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-12">
            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 text-[#03204c]"><KeyRound className="h-6 w-6" /><h1 className="text-2xl font-bold">Client JWT</h1></div>
                        <p className="mt-2 text-sm text-slate-500">A JWT requested from the browser using your Better Auth session.</p>
                    </div>
                    <button type="button" onClick={() => void loadToken()} disabled={loading} aria-label="Refresh JWT" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"></button>
                </div>

                {error ? <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-950 p-4 text-xs leading-6 text-emerald-300">{loading ? "Loading token..." : token}</pre>}
                <Link href="/jwt-server" className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800">View server JWT</Link>
            </section>
        </main>
    );
}
import Link from "next/link";
import { headers } from "next/headers";
import { KeyRound } from "lucide-react";
import { auth } from "@/app/lib/auth";

export default async function JwtServerPage() {
    const result = await auth.api.getToken({ headers: await headers() });

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-12">
            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-center gap-3 text-[#03204c]"><KeyRound className="h-6 w-6" /><h1 className="text-2xl font-bold">Server JWT</h1></div>
                <p className="mt-2 text-sm text-slate-500">A JWT generated on the server from the current Better Auth session.</p>
                <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-950 p-4 text-xs leading-6 text-emerald-300">{result?.token || "Sign in to retrieve a JWT."}</pre>
                <Link href="/jwt-client" className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800">View client JWT</Link>
            </section>
        </main>
    );
}
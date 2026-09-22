"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherEnterMarkRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const examId = searchParams.get("examId");
    const targetUrl = examId ? `/teacher/enterMarks?examId=${encodeURIComponent(examId)}` : "/teacher/enterMarks";
    router.replace(targetUrl);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[400px] items-center justify-center p-8 text-slate-500 font-medium text-sm">
      Redirecting to Enter Marks...
    </div>
  );
}

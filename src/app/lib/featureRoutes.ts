export type UserRole = "admin" | "teacher" | "student" | string;

export const FEATURE_NAMES = [
  "Student Management",
  "Teacher Management",
  "Attendance System",
  "Examinations",
  "Results",
] as const;

export type FeatureName = (typeof FEATURE_NAMES)[number];

export function getFeatureRouteForRole(feature: string, role?: string): string {
  const normalizedRole = (role || "").toLowerCase();

  switch (feature) {
    case "Student Management":
      if (normalizedRole === "admin") return "/admin/manageStudents";
      if (normalizedRole === "teacher") return "/teacher";
      if (normalizedRole === "student") return "/student";
      return "/admin/manageStudents";

    case "Teacher Management":
      if (normalizedRole === "admin") return "/admin/manageTeachers";
      if (normalizedRole === "teacher") return "/teacher";
      if (normalizedRole === "student") return "/student";
      return "/admin/manageTeachers";

    case "Attendance System":
      if (normalizedRole === "admin") return "/admin/viewAttendance";
      if (normalizedRole === "teacher") return "/teacher/viewAttendance";
      if (normalizedRole === "student") return "/student/viewAttendance";
      return "/admin/viewAttendance";

    case "Examinations":
      if (normalizedRole === "admin") return "/admin/allExams";
      if (normalizedRole === "teacher") return "/teacher/allExams";
      if (normalizedRole === "student") return "/student";
      return "/admin/allExams";

    case "Results":
      if (normalizedRole === "admin") return "/admin/viewResult";
      if (normalizedRole === "teacher") return "/teacher/viewResuls";
      if (normalizedRole === "student") return "/student/viewResuls";
      return "/admin/viewResult";

    default:
      if (normalizedRole === "admin") return "/admin";
      if (normalizedRole === "teacher") return "/teacher";
      if (normalizedRole === "student") return "/student";
      return "/";
  }
}

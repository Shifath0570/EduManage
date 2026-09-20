import { headers } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from './app/lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.redirect(new URL('/auth/Login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/manageTeachers',
    '/admin/manageStudents',
    '/admin/viewAttendance',
    '/admin/createExam',
    '/admin/allExams',
    '/admin/viewNotice',
    '/admin/manageBlogs',
    '/admin/contactMessages',
    '/admin/feeCollection',
    '/admin/teacherSalary',
    '/teacher',
    '/student',
    '/teacher/takeAttendance',
    '/teacher/viewAttendance',
    '/teacher/createExam',
    '/teacher/allExams',
    '/teacher/enterMarks',
    '/teacher/viewResuls',
    '/teacher/teacherSalary',
  ],
}

# 🎓 EduManage — School Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Project-EduManage-2563EB?style=for-the-badge" alt="EduManage" />
  <img src="https://img.shields.io/badge/Next.js-Framework-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <strong>A Modern, AI-Powered School Management Platform</strong>
</p>

<p align="center">
  EduManage is a cloud-based school management platform designed to connect administrators, teachers, students, and parents through a centralized digital ecosystem.
</p>

---

## 🌐 Live Application

**Live Website:**
https://edu-manage-umber-two.vercel.app/

**Frontend Repository:**
GitHub_Client

**Backend Repository:**
GitHub_Server

---

# 📌 Project Information

| Information          | Details                                |
| -------------------- | -------------------------------------- |
| **Project Name**     | EduManage — School Management Platform |
| **Team Name**        | Endgame_Warrior                        |
| **Team Code**        | EG-1302.2                              |
| **Project Type**     | Full-Stack School Management Platform  |
| **Application Type** | Cloud-Based Web Application            |
| **Frontend**         | Next.js, React, TypeScript             |
| **Backend**          | Node.js, Express.js                    |
| **Database**         | MongoDB, Mongoose                      |
| **Authentication**   | JWT, Better Auth                       |
| **AI Integration**   | OpenAI API / Gemini API                |
| **Deployment**       | Vercel / Node Environment              |
| **Version Control**  | GitHub                                 |

---

# 📖 About EduManage

EduManage is a modern school management platform designed to simplify everyday educational administration and create a connected learning environment.

The platform brings important school operations into one centralized system, including:

* Student management
* Teacher management
* Class and subject assignment
* Attendance management
* Examination management
* Result and marks management
* Leave management
* Fee collection
* Teacher salary management
* Notice management
* Blog management
* AI-powered academic interventions
* AI-generated leave applications
* AI notice generation
* Reports and analytics

The public-facing application also provides **Home, About, Notice Board, Latest Blog, and Contact Us** sections for visitors.

---

# 🎯 Purpose

The primary purpose of EduManage is to reduce manual school-management work by providing a centralized digital platform where administrators, teachers, and students can manage their academic and administrative activities efficiently.

The platform focuses on:

* Centralized school administration
* Secure role-based access
* Academic management
* Attendance tracking
* Examination and result management
* Financial management
* AI-assisted workflows
* Real-time dashboards and analytics
* Responsive user experience

---

# 👥 Development Team

### Team — Endgame_Warrior

1. **Kazi Mohammad Shariful Amin Shifath**
2. **Md Maksumul Haque Emon**
3. **Md. Osman Goni**
4. **Obaydur Rahman Ayon**

> **Team Code:** EG-1302.2

---

# 🔐 User Roles & Access Control

EduManage provides role-based access control to ensure that users can only access the features relevant to their responsibilities.

| Role                    | Main Access                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| 🌐 **Public / Visitor** | Home, About, Routine, Notice, Blog, EduChat, Contact                         |
| 🎓 **Student**          | Dashboard, Profile, Attendance, Results, Leave Request, Fee Collection       |
| 👨‍🏫 **Teacher**       | Dashboard, Profile, Attendance, Exams, Marks, Results, Leave Request, Salary |
| 👨‍💼 **Admin**         | Complete administration, management, academic, finance, and content modules  |

---

# ✨ Core Features

## 🌐 Public Website

The public platform provides:

* Modern landing page
* About EduManage
* Notice Board
* Latest Blog
* Contact Us
* Routine
* EduChat
* Platform Features
* Campus Statistics
* Responsive navigation
* Dynamic content sections

The live homepage highlights Student Management, Teacher Management, Attendance, Examination & Results, Notice & Communication, and Reports & Analytics.

---

# 👨‍🎓 Student Management

Administrators can create and manage student records through a detailed registration system.

### Student Registration

The registration form supports:

* Profile picture
* Student name
* Email
* Phone
* Date of birth
* Gender
* Address
* Guardian name
* Guardian phone
* Class
* Section
* Student ID
* Roll number
* Admission date

### AI Data Export

The platform also provides:

> **Spark AI Data → Excel**

Administrators can generate structured student information and export it as an Excel file.

### Manage Students

Features include:

* Search by name
* Search by roll
* Search by email
* Class filtering
* Section filtering
* Reset filters
* Total student count
* Student profile
* Edit student
* Activate/deactivate
* Delete student
* Pagination
* Configurable records per page

---

# 👨‍🏫 Teacher Management

EduManage provides a complete teacher management workflow.

### Teacher Registration

Teacher profiles can include:

* Full name
* Email
* Phone
* Date of birth
* Gender
* Blood group
* Profile photo
* Qualifications
* Subject specialization
* Experience
* Joining date
* Employee ID
* Address
* City
* State/Province
* Post code
* Guardian information
* Emergency contact

### Teacher Management

Administrators can:

* Search teachers
* Filter by subject
* View teacher profiles
* Edit teacher information
* Assign classes
* Assign subjects
* Activate/deactivate teachers
* Manage multiple academic assignments

---

# 🏫 Teacher Class & Subject Assignment

The assignment module allows administrators to connect teachers with their academic responsibilities.

Administrators can assign:

* Class
* Section
* Subject
* Academic Year

Multiple assignments can be created for a single teacher.

### Conditional Workflow

A teacher must have an active class and subject assignment before accessing operational academic features.

For example, an unassigned teacher cannot:

* Take attendance
* Create examinations
* Enter student marks
* Perform result-related operations

This business rule helps maintain academic data integrity.

---

# 📝 Attendance Management

EduManage provides role-based attendance management.

### Teacher

Teachers can:

* Select class
* Select subject
* Select date
* View students
* Mark Present/Absent
* Submit attendance
* View attendance records

### Student

Students can:

* View attendance history
* View attendance percentage
* Monitor attendance performance

### Admin

Administrators have **read-only access** to attendance information across classes and departments.

---

# 🤖 AI-Powered Attendance Intervention

EduManage includes an AI-based academic intervention workflow.

The system identifies students whose cumulative attendance falls below the defined **75% threshold**.

Teachers can trigger an AI analysis that generates a personalized academic warning based on the student's attendance records.

The generated warning can then appear in the student's dashboard notification feed.

### Workflow

```text
Student Attendance
        ↓
Attendance Calculation
        ↓
Below 75%?
        ↓
AI Analysis
        ↓
Academic Warning
        ↓
Student Dashboard Notification
```

---

# 📚 Examination Management

EduManage provides complete examination workflows for administrators and teachers.

### Admin Features

* Create Exam
* All Exam List
* Enter Marks
* View Results
* Exam management
* Class filtering
* Section filtering
* Student filtering
* Exam target validation

### Teacher Features

* Create Exam
* My Exams
* All Exams
* View Exam
* Edit Exam
* Delete Exam
* Enter Marks

Teacher exam operations are restricted according to their assigned class, section, and subject.

---

# 📊 Result & Marks Management

The result system supports:

* Exam-based result viewing
* Student-wise results
* Subject-wise results
* Total marks
* GPA/result information
* Class filtering
* Subject filtering
* Student selection
* Marks entry
* Marks update
* Result management

### Result Access

| Role    | Result Access                           |
| ------- | --------------------------------------- |
| Admin   | View & manage                           |
| Teacher | View & manage assigned academic results |
| Student | View personal results                   |

---

# 🤖 AI-Powered Leave Management

One of the major AI features of EduManage is the intelligent leave-request system.

Teachers and students can create leave applications using an AI-assisted workflow.

### Leave Request

Users can provide:

* Applicant information
* Leave type
* Start date
* End date
* Purpose
* Subject/reason

The AI generates a formal leave application based on the provided information.

### Workflow

```text
User Information
       ↓
Leave Type
       ↓
Date & Duration
       ↓
Purpose / Reason
       ↓
AI Generate Application
       ↓
Application Preview
       ↓
Submit Request
       ↓
Admin Review
       ↓
Pending / Approved / Rejected
```

---

# 🧑‍💼 Admin Leave Management

Administrators can manage both teacher and student leave requests.

### Features

* Teacher/Student toggle
* Pending requests
* Approved requests
* Rejected requests
* Search by applicant
* Search by reason
* Status filtering
* View complete application
* Approve request
* Reject request
* Track request status

---

# 💰 Finance Management

EduManage includes dedicated finance workflows.

## Student Fee Collection

Features include:

* Fee calculation
* Payment confirmation
* Payment records
* Student receipts
* PDF voucher generation
* Voucher download

## Teacher Salary

The salary module supports:

* Salary information
* Salary management
* Salary slip generation
* PDF export

---

# 📄 PDF Voucher System

A PDF export mechanism is implemented for financial documents.

Supported documents include:

* Student payment receipts
* Fee vouchers
* Teacher salary slips

The system supports client/server-based document generation and downloading.

---

# 📢 Notice Management

Administrators can create and manage school notices.

The platform includes a dynamic notice board and announcement marquee for displaying important school updates.

The live application currently exposes a dedicated Notice Board containing categorized notices and status information such as draft, published, expired, and archived.

---

# 🤖 AI Notice Writer

EduManage includes an AI-powered notice generation feature.

Administrators can provide a prompt or basic information and generate structured notice content automatically.

### Example Workflow

```text
Admin Prompt
     ↓
AI Processing
     ↓
Generated Notice
     ↓
Admin Review
     ↓
Publish Notice
```

---

# 📰 Blog Management

Administrators can create and manage educational blog content.

The public Blog section provides:

* Article search
* Topic/category filtering
* Education articles
* Technology articles
* Teacher-related content
* Student-life content
* Educational updates
* Newsletter subscription

The live Blog page currently organizes content into categories such as Education, Technology, Teachers, and Student Life.

---

# 📈 Admin Dashboard & Analytics

The Admin Dashboard provides centralized monitoring of school activities.

### Dashboard Statistics

* Total Students
* Total Teachers
* Total Classes
* Total Subjects
* Attendance Rate
* Exams Conducted

### Analytics

The dashboard includes:

* Gender distribution
* Daily activity tracking
* Weekly percentage tracking
* Recent student enrollments
* Student/class/email information
* Active status
* Dynamic statistics
* Administrative insights

---

# 👨‍🎓 Student Portal

The Student Portal provides a dedicated dashboard experience.

### Student Features

* Student Dashboard
* Student Profile
* Attendance
* Results
* Leave Request
* Fee Collection
* Notifications
* AI Academic Insights

The student profile area also provides an AI academic insight section designed to provide motivational and academic information.

---

# 👨‍🏫 Teacher Portal

Teachers receive a dedicated portal containing:

* Teacher Dashboard
* Teacher Profile
* Attendance Management
* Exam Management
* Marks Entry
* Result Management
* Leave Request
* Salary Information
* Assigned Class
* Assigned Subjects

The teacher profile provides professional information, experience, address, and emergency contact details.

---

# 🔒 Security & Authentication

Security was an important part of the EduManage development process.

## JWT Protection

JSON Web Token authentication was implemented across protected API operations.

JWT middleware is used to:

* Verify authentication tokens
* Protect API endpoints
* Validate user identity
* Prevent unauthorized operations

## Role-Based Authorization

Role-based validation is applied to sensitive operations.

```text
Public User
    ↓
Authentication
    ↓
JWT Verification
    ↓
Role Validation
    ↓
Authorized Feature
```

Supported roles include:

* Admin
* Teacher
* Student

---

# 🛡️ Security Hardening

The project also focused on vulnerability remediation and API security.

Implemented security improvements include:

* JWT-protected API endpoints
* Role-based authorization
* Password hashing with bcrypt
* CORS configuration
* Environment variables
* Protected management operations
* Restricted academic workflows
* Authentication validation

---

# 🎨 UI/UX & Responsive Design

EduManage was designed with a modern responsive interface.

### Responsive Support

The interface is designed for:

* 📱 Mobile
* 📱 Tablet
* 💻 Desktop

The project uses:

* CSS Grid
* Flexbox
* Tailwind CSS
* Responsive layouts
* Dynamic UI components
* Modern dashboard interfaces

---

# 🏠 Landing Page

The landing page includes:

* Hero section
* Navigation
* Notice marquee
* Platform features
* Campus statistics
* Notice board
* Latest blogs
* Why Choose EduManage
* Testimonials
* Contact section
* Footer

The live homepage describes EduManage as a centralized platform for students, teachers, parents, and administrators and highlights its major management modules.

---

# 🧩 Platform Modules

```text
EduManage
│
├── Public Website
│   ├── Home
│   ├── About
│   ├── Routine
│   ├── Notice
│   ├── Blog
│   ├── EduChat
│   └── Contact
│
├── Student Portal
│   ├── Dashboard
│   ├── Profile
│   ├── Attendance
│   ├── Results
│   ├── Leave Request
│   └── Fee Collection
│
├── Teacher Portal
│   ├── Dashboard
│   ├── Profile
│   ├── Attendance
│   ├── Exams
│   ├── Marks
│   ├── Results
│   ├── Leave Request
│   └── Salary
│
└── Admin Portal
    ├── Dashboard
    ├── Students
    ├── Teachers
    ├── Assignments
    ├── Attendance
    ├── Exams
    ├── Results
    ├── Leave Management
    ├── Notices
    ├── Blogs
    ├── Contact Messages
    ├── Fee Collection
    └── Teacher Salary
```

---

# 🛠️ Technologies Used

## Frontend

* Next.js
* TypeScript
* React Router DOM
* Tailwind CSS
* CSS Modules
* CSS Grid
* Flexbox
* Lucide React
* React Icons
* Fetch API

## Backend

* Node.js
* Express.js
* REST API
* MongoDB
* Mongoose

## Authentication & Security

* JWT
* Better Auth
* bcrypt
* CORS
* dotenv
* Role-Based Access Control

## AI Integration

* OpenAI API
* Gemini API
* Prompt-based AI workflows
* AI-generated notices
* AI leave applications
* AI academic interventions

## Deployment & Tools

* Vercel
* Node.js environment
* Git
* GitHub

---

# 🔄 Application Workflow

```text
                    EduManage
                       │
          ┌────────────┼────────────┐
          │            │            │
       Student       Teacher       Admin
          │            │            │
          ↓            ↓            ↓
      Dashboard    Dashboard    Admin Panel
          │            │            │
     Attendance     Attendance    Management
     Results        Exams         Students
     Leave          Marks         Teachers
     Fees           Results       Exams
                    Leave         Results
                    Salary        Finance
                                  Notices
                                  Blogs
                                  Analytics
```

---

# 🤖 AI Integration Architecture

EduManage integrates AI into practical school-management workflows rather than using AI only as a standalone chatbot.

### AI Features

| AI Feature                 | Purpose                               |
| -------------------------- | ------------------------------------- |
| 🤖 Attendance Intervention | Generate academic warnings            |
| 📝 AI Leave Application    | Generate formal leave letters         |
| 📢 AI Notice Writer        | Generate school notices               |
| 📊 Academic Insight        | Support student performance awareness |
| 📄 AI Data Export          | Generate structured management data   |

---

# 📊 Key Project Requirements

### Functional Requirements

* Role-based authentication
* Student registration
* Teacher registration
* Student management
* Teacher management
* Teacher assignment
* Attendance management
* Examination management
* Marks management
* Result management
* Leave management
* Fee collection
* Teacher salary
* Notice management
* Blog management
* Contact message management
* AI integrations
* PDF generation
* Excel export

### Non-Functional Requirements

* Responsive UI
* Secure authentication
* Role-based authorization
* API security
* Maintainable architecture
* Scalable database design
* Responsive dashboard
* Consistent UI/UX
* Reliable data management

---

# 🧠 Key Learnings & Project Takeaways

Through the development of EduManage, I gained practical experience in full-stack development, security, AI integration, API development, responsive UI/UX, and collaborative software engineering.

## 1. Role-Based Access Control

Developed a deeper understanding of designing secure permission systems by defining clear responsibilities for Admin, Teacher, and Student roles and ensuring sensitive operations are available only to authorized users.

## 2. API Security & Authentication

Gained practical experience securing REST APIs using JWT authentication and authorization middleware.

Learned how to:

* Protect API endpoints
* Verify tokens
* Validate user roles
* Prevent unauthorized requests
* Strengthen API security

## 3. AI-Powered Application Development

Learned how to integrate AI services into real-world application workflows.

Implemented practical AI use cases such as:

* Academic warnings
* Leave applications
* Notice generation
* Academic insights

## 4. Full-Stack Development & API Integration

Strengthened my ability to connect frontend interfaces with backend REST APIs, manage MongoDB data through Mongoose, and build complete frontend-to-backend workflows.

## 5. Agile & Iterative Development

Learned how to work through an iterative development process by gradually transforming requirements and designs into functional application features.

## 6. Responsive UI/UX Development

Improved my ability to build responsive and accessible interfaces using:

* Next.js
* Tailwind CSS
* CSS Grid
* Flexbox

for consistent experiences across mobile, tablet, and desktop devices.

## 7. Problem-Solving & Debugging

Developed stronger debugging skills by identifying and resolving:

* Authentication problems
* API vulnerabilities
* Integration issues
* Frontend/backend inconsistencies
* Data-binding problems
* Access-control issues

## 8. Team Collaboration

Gained practical experience working within a development team by:

* Dividing development tasks
* Coordinating implementation
* Discussing technical problems
* Reviewing features
* Managing project requirements
* Working toward shared milestones

---

# 🚀 Installation & Local Development

## 1. Clone the Frontend Repository

```bash
git clone <frontend-repository-url>
cd <frontend-project-folder>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_APP_URL=your_frontend_url

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

> Add only the environment variables actually required by your implementation.

## 4. Run Development Server

```bash
npm run dev
```

The application will run locally on:

```text
http://localhost:3000
```

---

# 🔧 Backend Setup

```bash
git clone <backend-repository-url>
cd <backend-project-folder>
npm install
```

Configure the backend environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=your_frontend_url
```

Run the backend:

```bash
npm run dev
```

---

# 📁 Suggested Project Architecture

```text
EduManage
│
├── Client
│   ├── app/
│   ├── components/
│   ├── dashboard/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── utils/
│   └── public/
│
└── Server
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── services/
    ├── utils/
    ├── config/
    └── server.js
```

> Adjust this structure to match the final repository structure.

---

# 🚀 Deployment

### Frontend

The frontend is deployed using **Vercel**.

### Backend

The backend can be deployed using a Node.js-compatible hosting environment such as:

* Vercel
* Render
* Other Node.js hosting services

### Database

MongoDB is used as the primary database with Mongoose as the ODM layer.

---

# 🔮 Future Improvements

Potential future improvements include:

* 📱 Dedicated mobile application
* 🔔 Real-time push notifications
* 💬 Parent portal
* 📅 Advanced timetable management
* 📊 Advanced academic analytics
* 🤖 AI-powered student performance prediction
* 🧑‍🏫 AI teacher assistant
* 📚 AI learning recommendations
* 💳 Online payment gateway
* 📧 Automated email notifications
* 📱 SMS notification system
* 📄 Advanced report generation
* 🔍 Advanced global search
* 🌍 Multi-school / multi-institution support

---

# 📸 Screenshots

Add screenshots of the major interfaces here:

```text
screenshots/
├── homepage.png
├── admin-dashboard.png
├── student-dashboard.png
├── teacher-dashboard.png
├── manage-students.png
├── manage-teachers.png
├── attendance.png
├── examination.png
├── results.png
├── leave-management.png
└── ai-features.png
```

Example:

```md
## 📸 Screenshots

### Homepage
![EduManage Homepage](./screenshots/homepage.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

### Teacher Dashboard
![Teacher Dashboard](./screenshots/teacher-dashboard.png)

### Student Dashboard
![Student Dashboard](./screenshots/student-dashboard.png)
```

---

# 👨‍💻 Developers

## Kazi Mohammad Shariful Amin Shifath

**Software Engineer | Full Stack Developer**

Contributed to the development of EduManage with a focus on:

* Full-stack application development
* Admin dashboard
* Student management
* Teacher management
* Leave management
* Attendance workflows
* AI integrations
* JWT authentication
* API security
* Responsive UI/UX
* Database integration
* Debugging and system improvements

### Connect With Me

* **GitHub:** `Shifath0570`
* **LinkedIn:** Add your LinkedIn profile

---

# 👥 Team Endgame_Warrior

| Developer                               | Role                               |
| --------------------------------------- | ---------------------------------- |
| **Kazi Mohammad Shariful Amin Shifath** | Full Stack Developer               |
| **Md Maksumul Haque Emon**              | Full Stack Developer               |
| **Md. Osman Goni**                      | Full Stack Developer               |
| **Obaydur Rahman Ayon**                 | Full Stack Developer               |

---

# 📜 Project Status

**Status:** ✅ Completed / Production Deployed

EduManage is deployed as a live web application and demonstrates a complete full-stack school management workflow with role-based access, academic management, finance modules, AI-powered features, and responsive dashboards.

---

# ⭐ Project Highlights

```text
✓ Role-Based Access Control
✓ Student Management
✓ Teacher Management
✓ Class & Subject Assignment
✓ Attendance Management
✓ 75% Attendance Warning System
✓ Examination Management
✓ Marks Entry
✓ Result Management
✓ AI Leave Application
✓ AI Notice Writer
✓ AI Academic Intervention
✓ Fee Collection
✓ Teacher Salary
✓ PDF Voucher Generation
✓ Excel Data Export
✓ Notice Management
✓ Blog Management
✓ Contact Message Management
✓ Admin Analytics Dashboard
✓ JWT API Security
✓ Responsive UI/UX
✓ Full-Stack REST API Architecture
```

---

# 📄 License

This project was developed as a team software engineering project for educational and portfolio purposes.

---

<p align="center">
  <strong>🎓 EduManage — Empowering Education Through Smart Technology</strong>
</p>

<p align="center">
  Built with ❤️ by <strong>Endgame_Warrior</strong>
</p>



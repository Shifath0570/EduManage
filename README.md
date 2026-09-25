vercel link : https://edu-manage-umber-two.vercel.app/


EduManage — School Management Platform
Project Name: EduManage: School Management Platform
Team Name: Endgame_Warrior
Team Code: EG-1302.2
Live Application: Live link
Frontend  Repository:  GitHub_Client
Backend  Repository:  GitHub_Server


Developers
1.	Kazi Mohammad Shariful Amin Shifath
2.	Md Maksumul Haque Emon
3.	Md. Osman Goni
4.	Obaydur Rahman Ayon

1.	Executive Summary & Purpose


Purpose
This Software Requirements Specification (SRS) documents the detailed functional, non-functional, and architectural requirements for EduManage, a cloud-based web application built to streamline school administration, AI-driven academic intervention, across public visitors, students, teachers, and administrators.



2.	User Roles & Access Control Matrix

Role							Access Permissions

Public / Visitor	Access to Home page, About, Routine, Notice, Blog, EduChat, Contact,

Student	Access to Student Dashboard, Student  Profile, View Attendance, View Results, Leave Request, Fee Collection.

Teacher	Access to Teacher Dashboard, Teacher  Profile, Take Attendance, View Attendance, Create Exam, All Exam List, Enter Marks, View Results, Leave Request, Teacher Salary.

Admin	Access to Admin Dashboard, Overview, Create Student, Create Teacher, Manage Teachers, Manage Students, View Attendance, Create Exam, All Exam List, Leave Management, Manage Notice, Manage Blogs, Contact Messages, Fee Collection, Teacher Salary.


3.	Functional Requirements

•	Navigation Elements & Dynamic Header: Positioned the EduManage platform logo on the far left of the header, Structured centered links for public routes, Integrated Better Auth state handling, Unauthenticated State Displays a direct Login button at the right end. Authenticated State Replaces the login button with a user profile avatar and a Logout button.
•	Create Student Registration Form : Built a profile picture upload component alongside personal profile initials, Integrated inputs for Name, Email, Phone, Date of Birth, Gender, and Address, Added input fields for Guardian Name, Guardian Phone, dropdown selectors for Class and Section, and text inputs for Student ID, Roll Number, and Admission Date, Integrated a button for Spark AI Data to Excel and a primary action button to Create Student & Export Excel.

•	Create Teacher Registration Form : Built input fields for Full Name, Email, Phone, Date of Birth, Gender, Blood Group, and Profile Photo upload,  Added inputs for Qualifications, Subject Specialization dropdown, Experience (Years), Joining Date, and Employee ID, Created fields capturing fullAddress, CityState/Province, Post Code, Guardian Name,Guardian Phone, and Emergency Contact, Integrated Export AI Data to Excel and a submit button to Add Teacher & Export Excel.

•	Manage Teachers Portal : Added a top search bar filtering by name, email, or phone, alongside an All Subjects dropdown filter, Reset control, and a total record indicator, Structured columns for Teacher Info (avatar, name, email, phone number), Subject(s) (badge indicator like Physics, Chemistry, Biology), Status (Active), and row-level Actions (view, assing, active). Included bottom pagination with page navigation controls.

•	Manage Students Portal : Implemented a unified search bar (by name, roll, or email), All Classes and All Sections dropdown filters, a Reset button, and a total record count badge, Formatted columns displaying #, Student Info (avatar, student name, roll number, email address), Class, Section, status badge (Active), and row-level action icons (view, active, delete), Added bottom pagination controls with an configurable Per page dropdown menu and page selection buttons.

•	Edit Student Details : Comprehensive input form allowing administrators to update personal fields (Name, Email, Phone, DOB, Gender, Address), guardian information (Name, Phone), and academic fields (Class, Section, Student ID, Roll Number, Admission Date),Preview: Features a Change Profile Picture action and a preview list of Auto-assigned Subjects.

•	Edit Teacher Details : Full update interface covering personal attributes, qualifications, specialization dropdown, experience years, employee ID, location details, guardian info, and emergency contact numbers. Includes a Change Profile Picture feature and form action buttons (Cancel, Save Changes).

•	Teacher Subject & Class Assignment Module : Displays profile details for the selected teacher (name, email, phone, subject), Form panel allowing administrators to select Class, Section, Subject (dynamically dependent on class selection), and set the Academic Year. Shows active mapped courses with a row-level Delete action to remove allocations. Multiple assignments per teacher are supported.

•	Conditional Operational Task Workflow : Implemented business logic requiring teachers to have active class/subject assignments before unlocking functional modules, Unassigned teachers are prevented from executing operational routines, such as taking/viewing attendance, creating exams, or entering student marks/results until assigned to an active class.

•	Attendance Management : The system shall allow Teachers to dynamically mark students as Present or Absent for given dates and subjects.The system shall calculate individual student attendance percentages automatically upon data submission.The Admin role shall only have Read access to attendance records across all classes and departments.

•	AI-Powered Interventions : The system shall flag any student whose cumulative attendance drops below 75%.Teachers shall be able to trigger an AI analysis request that generates a tailored academic warning based on attendance records. AI-generated warnings shall be delivered to the target student's personal dashboard notification feed.

•	Content Management & AI Blogging : The system shall allow Admins to publish blog posts manually or via AI text generation.The system shall provide a client-side or backend-driven search bar for real-time blog filtering.

•	Communication & System Messaging : Public users shall be able to submit messages via the "Contact Us" form. Successful form submissions shall emit a notification indicator on the Admin Dashboard. Admins shall be able to read, inspect, and organize incoming contact messages inside a dedicated portal view.

•	Dynamic Attendance & Analytics : Interactive UI for Teachers to record and track daily attendance across classes. Role-restricted institutional attendance monitoring for System Administrators. Student portal displaying individual attendance summaries and real-time attendance percentage metrics. Automatic system flagging for students falling below the 75% attendance threshold or accumulating critical absences.

•	Teacher & Student AI Leave Request Page : Automatically populates active applicant metadata, including name, role, and official email address, Provides fields to set the Leave Type (e.g., Sick Leave, Maternity/Paternity Leave), Start Date, End Date, and Purpose of Leave subject line, Features an automated Generate Application engine that uses AI to draft a formal application letter in the Generated Application Preview window, Includes a Submit Leave Application action alongside a Submitted Requests panel to track application statuses (Pending, Approved, Rejected) and view submitted letters.

•	Admin Portal Leave Management : Toggle controls to switch views between Teachers and Students alongside metric cards for Pending Approval, Approved Requests, and Rejected Requests, Features a search bar (by name or reason) and dynamic status filter chips (Pending, Approved, Rejected, All), Displays structured records showing Applicant name, Type / Reason, date Duration, status indicators (Pending, Approved, Rejected), and action links to View full details.

•	Finance Modules: Provisioned dedicated workflows for Student Fee Collection and Teacher Salary.

•	AI Notice Writer: Built prompt-based automated notice content generator.

•	Fee Calculations: Enhanced accuracy of client-side fee calculations and data binding.

•	PDF Voucher Engine: Built client/server export mechanism for fee receipts and salary slips.

•	Student Receipts: Completed end-to-end payment confirmation and PDF voucher downloading.

•	Initial Academic Module Development : Teacher Result workflow, Teacher Enter Marks functionality,  Admin/Teacher marks management, Exam-based student selection, Class and Subject based filtering, Student list for marks entry, Marks save/update workflow, Initial result management structure.

•	Result Management & Exam Structure : Admin View Result, Teacher View Result, Student View Result structure, Result filtering, Exam-based result viewing, Subject-wise result display, Student-wise academic information, Total marks and GPA/result information.

•	Admin Examination Management : Admin Create Exam, Admin All Exam List, Admin Enter Mark, Admin View Result, Exam creation form, Exam information management, Exam API integration, Class and Section based student filtering, Exam target validation.

•	Teacher Module, AI Features & Routine : Implemented the Teacher Create Exam functionality with the required restrictions based on the teacher's assigned academic information, All Exams, My Exams, Exam viewing, Own exam management, Edit functionality, Delete functionality.




4.	 Non-Functional Requirements

•	Hero & Landing Interface: Built core UI components and public landing hero section.

•	Notice Marquee Component: Built an animated horizontal scrolling announcement bar tagged with a green NOTICE badge to highlight live campus updates.

•	Platform Features Static Section: Implemented a 6-card feature grid detailing core platform capabilities, Student Management, Teacher Management, Attendance System, Examination & Results, Notice & Communication, Reports & Analytics.

•	Campus Statistics Static Section: Developed a key metrics section displaying core campus statistics in icon cards, Total Students, Teachers, Classes, Subjects, Attendance Rate, Exams Conducted.

•	Notice Board Architecture: Designed layout structure for notice feeds and dynamic blogs.

•	Student Portal Student Profile : Built dedicated student portal sidebar containing quick navigation items, Integrates a top banner featuring an AI Academic Insight motivational component along with thefull student profile view.

•	Teacher Portal Teacher Profile : Integrated portal sidebar for faculty members with routes, Presents detailed teacher profile information, professional metrics, experience, address details, and emergency contacts within the teacher portal frame.

•	Dynamic Admin Overview Dashboard : Top dynamic stats showing real-time counts and percentage growth indicators, Dynamic distribution showing gender demographics, Real-time daily tracker, Weekly percentage tracking over time, Live feed displaying recent enrollments with name, class, email, and active status,

•	Admin Dashboard Overview: Populated administrative metrics with real-time dynamic visualizers.

•	Interface & Responsiveness : The application interface shall be 100% responsive, passing WCAG view standards across mobile (768px), tablet (768px - 1024px), and desktop (1024px).


4.1	Security Hardening & Vulnerability Remediation 

•	UI/UX Modernization: Overhauled the complete application UI to deliver a modern, responsive user experience with updated layouts, improved navigation, and dynamic UI components.

•	JWT Protection on Core Operations: Implemented JSON Web Token (JWT) authentication across all protected API endpoints, securing all management systems.

•	Role-Based Security & Access Control: Applied role-based token validation across all sensitive actions to systematically block unauthenticated or unauthorized requests.


5.	 Technologies Used

5.1	Frontend Stack

•	Framework G Libraries: Next.js, React Router DOM (SPAs navigation)

•	Styling G UI Components: Tailwind CSS / CSS Modules, Responsive Grid & Flexbox

•	Icons G UI Utilities: Lucide React / React Icons

•	HTTP Client: Fetch API

5.2	Backend Stack

•	Runtime Environment: Node.js
•	Web Framework: Express.js
•	Database G ODM: MongoDB & Mongoose
•	Authentication G Security: JSON Web Tokens (JWT), bcrypt (password hashing), CORS, Environment Configuration (dotenv)

5.3	AI Integration

•	AI Models G Engine: OpenAI API / Gemini API  

5.4	Deployment & Infrastructure

•	Frontend Hosting: Vercel
•	Backend Hosting: Vercel / Render / Node Environment
•	Version Control: GitHub (separate frontend and server repositories)


6.	Key Learnings & Project Takeaways
Through the development of EduManage, I gained practical experience in full-stack 
development, system security, AI integration, and collaborative software engineering. 
My key learnings include:
1.	Role-Based Access Control: Developed a deeper understanding of designing secure permission systems by defining clear responsibilities for each user role and ensuring that sensitive operations are accessible only to authorized users.

2.	API Security & Authentication: Gained practical experience in securing REST APIs using JWT authentication and authorization middleware. Learned how to identify exposed endpoints, prevent unauthorized requests, and strengthen overall API security.

3.	AI-Powered Application Development: Learned how to integrate AI services into real-world application workflows and use prompt-based automation to generate useful content and support academic management processes.

4.	Full-Stack Development & API Integration: Strengthened my ability to connect frontend interfaces with backend REST APIs, manage data using MongoDB and Mongoose, and build dynamic features across the complete application stack.

5.	Agile & Iterative Development: Learned how to work through an iterative development process, gradually transforming initial designs and requirements into functional, secure, and production-ready application features.

6.	Responsive UI/UX Development: Improved my ability to create responsive and accessible interfaces using Next.js, Tailwind CSS, CSS Grid, and Flexbox for consistent experiences across mobile, tablet, and desktop devices.

7.	Problem-Solving & Debugging: Developed stronger debugging and problem-solving skills by identifying authentication issues, API vulnerabilities, integration errors, and frontend/backend inconsistencies during development.

8.	Team Collaboration: Gained practical experience working within a development team, coordinating tasks, discussing technical challenges, reviewing implementations, and contributing to a shared project roadmap.


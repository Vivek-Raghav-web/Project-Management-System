# 📚 College Project Management System

A full-stack **College Project Management System** built using the **MERN Stack** that helps colleges manage student projects, teacher supervision, project approvals, deadlines, notifications, file uploads, and authentication through a secure role-based system.

The system provides separate dashboards for:

- 👨‍🎓 Students
- 👨‍🏫 Teachers
- 👨‍💼 Admins

with complete project workflow management.

---

# 🚀 Main Features

## 🔐 Authentication & Security
- JWT Authentication
- Role-Based Authorization
- Protected API Routes
- Google OAuth Login
- OTP Email Verification
- Password Hashing using bcrypt
- Middleware-Based Access Control

---

# 👨‍🎓 Student Features

- Submit Project Proposal
- Request Supervisor/Teacher
- Upload Project Files
- View Project Status
- Receive Notifications
- Track Deadlines
- View Feedback
- Dashboard Access

---

# 👨‍🏫 Teacher Features

- Receive Student Requests
- Accept / Reject Requests
- View Assigned Students
- Access Student Projects
- Receive Notifications
- Give Feedback
- Manage Student Supervision

---

# 👨‍💼 Admin Features

- Full System Control
- Add / Remove Students
- Add / Remove Teachers
- Approve / Reject Projects
- Assign Supervisors
- Set Project Deadlines
- Monitor Project Activities
- View Student & Teacher Lists
- Manage Notifications

---

# 🔔 Notification System

The system includes a dynamic notification system.

## Students Receive Notifications When:
- Proposal submitted
- Teacher request sent
- Teacher accepts/rejects request
- Admin approves/rejects project
- Supervisor assigned
- Deadline updated
- Feedback received

## Teachers Receive Notifications When:
- Student sends supervisor request
- Admin assigns student project
- Project gets approved/rejected

---

# 📂 File Upload System

Students can upload:
- 📄 Reports
- 📊 Presentations
- 💻 Source Code
- 📁 Other Project Files

Uploads are handled using **Multer Middleware**.

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JWT
- Google OAuth
- OTP Verification

## File Upload
- Multer

## Email Service
- Nodemailer

---

# 📸 Screenshots

## 🔑 Login Page

<img src="./screenshot/Screenshot 2026-05-19 235808.png" width="100%"/>

---

## 📝 Signup Page

<img src="./screenshot/Screenshot 2026-05-19 235829.png" width="100%"/>

---

## 📊 Student Dashboard

<img src="./screenshot/student/Screenshot 2026-05-19 235255.png" width="100%"/>

<img src="./screenshot/student/Screenshot 2026-05-19 235339.png" width="100%"/>

<img src="./screenshot/student/Screenshot 2026-05-19 235430.png" width="100%"/>

<img src="./screenshot/student/Screenshot 2026-05-19 235457.png" width="100%"/>

<img src="./screenshot/student/Screenshot 2026-05-19 235514.png" width="100%"/>

---

## 👨‍🏫 Teacher Dashboard

<img src="./screenshot/teacher/Screenshot 2026-05-19 234924.png" width="100%"/>

<img src="./screenshot/teacher/Screenshot 2026-05-19 234951.png" width="100%"/>

<img src="./screenshot/teacher/Screenshot 2026-05-19 235015.png" width="100%"/>

<img src="./screenshot/teacher/Screenshot 2026-05-19 235052.png" width="100%"/>

<img src="./screenshot/teacher/Screenshot 2026-05-19 235113.png" width="100%"/>

---

## 👨‍💼 Admin Dashboard

<img src="./screenshot/admin/Screenshot 2026-05-19 234251.png" width="100%"/>

<img src="./screenshot/admin/Screenshot 2026-05-19 234320.png" width="100%"/>

<img src="./screenshot/admin/Screenshot 2026-05-19 234405.png" width="100%"/>

<img src="./screenshot/admin/Screenshot 2026-05-19 234434.png" width="100%"/>

<img src="./screenshot/admin/Screenshot 2026-05-19 234454.png" width="100%"/>

<img src="./screenshot/admin/Screenshot 2026-05-19 234524.png" width="100%"/>


# 🔄 Project Workflow

```text
Student Registration/Login
        ↓
Submit Project Proposal
        ↓
Request Supervisor
        ↓
Teacher Accept/Reject Request
        ↓
Admin Approves Project
        ↓
Admin Assigns Deadline
        ↓
Student Uploads Files
        ↓
Teacher Reviews Project
        ↓
Feedback & Notifications
```

---

# 🗂️ Folder Structure

```bash
project/
│
├── frontend/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── googleAuth.js
│
├── screenshots/
│
└── README.md
```

---

# 🔒 Authentication Middleware

## verifyToken Middleware

- Verifies JWT token
- Protects private routes
- Adds logged-in user data into `req.user`

## allowRoles Middleware

Used for:
- Student-only routes
- Teacher-only routes
- Admin-only routes

---

# 🧩 Database Models

## User Model
Stores:
- Name
- Email
- Password
- Role
- OTP Verification
- Profile Image

---

## Project Model
Stores:
- Project Title
- Description
- Status
- Supervisor
- Deadline

---

## Request Model
Stores:
- Student Requests
- Teacher Requests
- Request Status

---

## Notification Model
Stores:
- Notifications
- Notification Type
- Read/Unread Status

---

## File Model
Stores:
- Reports
- PPT
- Source Code Files

---

# 🔗 API Endpoints

# 🔐 Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/verify-otp | Verify OTP |
| POST | /api/auth/resend-otp | Resend OTP |
| POST | /api/auth/login | Login User |
| GET | /api/auth/me | Get Logged-In User |
| GET | /auth/google | Google Login |

---

# 👨‍🎓 Student Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/student/dashboard | Get Dashboard |
| POST | /api/student/proposal | Submit Proposal |
| POST | /api/student/request-supervisor | Request Teacher |
| GET | /api/student/notifications | Get Notifications |
| GET | /api/student/feedback | Get Feedback |
| POST | /api/student/upload | Upload Files |

---

# 👨‍🏫 Teacher Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/teachers/notifications | Get Notifications |
| GET | /api/teachers/requests | View Requests |
| POST | /api/teachers/requests/:id | Accept/Reject Request |
| GET | /api/teachers/students | Assigned Students |
| POST | /api/teachers/feedback | Send Feedback |

---

# 👨‍💼 Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/deadlines | Get All Projects |
| PUT | /api/admin/deadline/:id | Update Deadline |
| PUT | /api/admin/assign-supervisor/:id | Assign Supervisor |
| PUT | /api/admin/approve/:id | Approve Project |
| PUT | /api/admin/reject/:id | Reject Project |

---

# 👥 CRUD Routes

## Student CRUD

| Method | Endpoint |
|--------|----------|
| POST | /api/students |
| GET | /api/students |
| GET | /api/students/:id |
| PUT | /api/students/:id |
| DELETE | /api/students/:id |

---

## Teacher CRUD

| Method | Endpoint |
|--------|----------|
| POST | /api/teachers |
| GET | /api/teachers |
| GET | /api/teachers/:id |
| PUT | /api/teachers/:id |
| DELETE | /api/teachers/:id |

---

# 🔐 Security Features

- JWT Token Authentication
- Role-Based Authorization
- OTP Verification
- Password Encryption
- Protected Routes
- Secure File Uploads

---

# 📧 Email Verification System

The project uses **Nodemailer** for OTP verification.

Features:
- OTP Generation
- OTP Expiry
- Resend OTP
- Gmail SMTP Integration

---

# 🌐 Google Authentication

Integrated using:
- Passport.js
- Google OAuth 2.0

Users can:
- Login with Google
- Automatically create account
- Receive JWT Token

---

# 🧠 ER Diagram

```text
User
 ├── Student
 ├── Teacher
 └── Admin

Student
 ├── Project
 ├── File
 ├── Notification
 └── Request

Teacher
 ├── Request
 ├── Notification
 └── Feedback

Project
 ├── Deadline
 └── Supervisor
```

---

# 📊 DFD (Data Flow Diagram)

```text
Student → Proposal Submission → Admin
Student → Supervisor Request → Teacher
Teacher → Accept/Reject → Student
Admin → Approve Project → Student
Admin → Assign Deadline → Student
Student → Upload Files → Teacher/Admin
Teacher → Feedback → Student
```

---

# ⚙️ Installation

# 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/college-project-management-system.git
```

---

# 2️⃣ Navigate to Folder

```bash
cd college-project-management-system
```

---

# 📦 Backend Setup

```bash
cd backend
npm install
```

---

# 🔑 Create .env File

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

# ▶️ Run Backend

```bash
npm start
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🎯 Project Objective

The objective of this project is to digitalize the college project management process and improve communication between students, teachers, and administrators using a secure and efficient system.

---

# 🔮 Future Improvements

- Real-Time Notifications using Socket.io
- Chat System
- Video Calling
- AI-Based Project Suggestions
- Cloud File Storage
- Email Reminder System

---

# 👨‍💻 Author

## Vivek Raghav

MERN Stack Developer

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.
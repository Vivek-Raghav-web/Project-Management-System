// ============================================================
// 📌 YE FILE SIRF REFERENCE HAI - apne existing App.jsx mein
//    teacher notifications route add karo is tarah:
// ============================================================

// App.jsx mein teacher routes ke andar add karo:

/*

import TeacherNotifications from "./pages/teacher/TeacherNotifications";

// Teacher routes ke andar:
<Route path="/teacher" element={<TeacherLayout />}>
  <Route index element={<Teacher />} />
  <Route path="requests" element={<PendingRequests />} />
  <Route path="students" element={<AssignedStudents />} />
  <Route path="reports" element={<ViewReports />} />
  <Route path="notifications" element={<TeacherNotifications />} />   // ✅ YE ADD KARO
  <Route path="settings" element={<Settings />} />
</Route>

*/

// ============================================================
// 📌 COMPLETE App.jsx EXAMPLE (agar tumhara App.jsx nahi hai):
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Admin";
import Students from "./pages/admin/StudentList";
import AddStudent from "./pages/admin/AddStudent";
import EditStudent from "./pages/admin/EditStudent";
import Teachers from "./pages/admin/TeacherList";
import AddTeacher from "./pages/admin/AddTeacher";
import EditTeacher from "./pages/admin/EditTeacher";
import ManageDeadlines from "./pages/admin/Deadline";
import DeadlineModal from "./pages/admin/UpdateDeadline";
import ProjectsDashboard from "./pages/admin/projects";
import ViewReportsAdmin from "./pages/admin/ViewReports";
import StudentAssignments from "./pages/admin/StudentAssigned";

// Student
import StudentLayout from "./pages/student/StudentLayout";
import Student from "./pages/student/Student";
import Proposal from "./pages/student/Proposal";
import Upload from "./pages/student/Upload";
import Supervisor from "./pages/student/Supervisor";
import Feedback from "./pages/student/Feedback";
import Notifications from "./pages/student/Notifications";        // ✅ Student Notifications

// Teacher
import TeacherLayout from "./pages/teacher/TeacherLayout";
import Teacher from "./pages/teacher/Teacher";
import PendingRequests from "./pages/teacher/PendingRequests";
import AssignedStudents from "./pages/teacher/AssignedStudents";
import TeacherNotifications from "./pages/teacher/TeacherNotications"; 
import TeacherReports from "./pages/teacher/Reports";


// ✅ NEW

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="edit-student/:id" element={<EditStudent />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="edit-teacher/:id" element={<EditTeacher />} />
          <Route path="deadlines" element={<ManageDeadlines />} />
          <Route path="updateDeadline" element={<DeadlineModal />} />
          <Route path="projects" element={<ProjectsDashboard />} />
          <Route path="reports" element={<ViewReportsAdmin />} />
          <Route path="assignments" element={<StudentAssignments />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Student />} />
          <Route path="proposal" element={<Proposal />} />
          <Route path="upload" element={<Upload />} />
          <Route path="supervisor" element={<Supervisor />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="notifications" element={<Notifications />} />  {/* ✅ Student */}
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Teacher />} />
          <Route path="requests" element={<PendingRequests />} />
          <Route path="students" element={<AssignedStudents />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="reports" element={<TeacherReports />} />
          
            {/* ✅ Teacher */}
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

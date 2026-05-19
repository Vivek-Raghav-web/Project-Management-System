// layout/StudentLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";

export default function StudentLayout() {
  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    navigate("/login");
  }
}, []);
  return (
    <>
      {/* 🔷 Top Navbar */}
      <Navbar title="Student Dashboard" />

      <div className="flex h-screen bg-gray-100">

        {/* 🔷 Sidebar */}
        <div className="w-64 bg-white shadow-lg p-4">
          <h2 className="text-xl font-bold mb-6">Student Panel</h2>

          <ul className="space-y-3">

            <li
              onClick={() => navigate("/student")}
              className="cursor-pointer hover:text-blue-500"
            >
              Dashboard
            </li>

            <li
              onClick={() => navigate("/student/proposal")}
              className="cursor-pointer hover:text-blue-500"
            >
              Submit Proposal
            </li>

            <li
              onClick={() => navigate("/student/upload")}
              className="cursor-pointer hover:text-blue-500"
            >
              Upload Files
            </li>

            <li
              onClick={() => navigate("/student/supervisor")}
              className="cursor-pointer hover:text-blue-500"
            >
              Supervisor
            </li>

            <li
              onClick={() => navigate("/student/feedback")}
              className="cursor-pointer hover:text-blue-500"
            >
              Feedback
            </li>

            <li
              onClick={() => navigate("/student/notifications")}
              className="cursor-pointer hover:text-blue-500"
            >
              Notifications
            </li>

          </ul>
        </div>

        {/* 🔷 Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* 🔥 Yaha content change hoga */}
        </div>

      </div>
    </>
  );
}
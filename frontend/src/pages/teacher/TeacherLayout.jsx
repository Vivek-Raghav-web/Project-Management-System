import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function TeacherLayout() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "teacher") {
      navigate("/login");
    }

  }, [navigate]);

  return (
    <>
      <Navbar title="Teacher Dashboard" />

      <div className="flex h-screen bg-gray-100">

        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg p-5">

          <h2 className="text-2xl font-bold mb-8 text-green-600">
            Teacher Panel
          </h2>

          <ul className="space-y-4 text-gray-700">

            {/* Dashboard */}
            <li
              onClick={() => navigate("/teacher")}
              className="cursor-pointer hover:text-green-600 flex items-center gap-3"
            >
              <span>🏠</span>
              Dashboard
            </li>

            {/* Pending Requests */}
            <li
              onClick={() => navigate("/teacher/requests")}
              className="cursor-pointer hover:text-green-600 flex items-center gap-3"
            >
              <span>⏳</span>
              Pending Requests
            </li>

            {/* Assigned Students */}
            <li
              onClick={() => navigate("/teacher/students")}
              className="cursor-pointer hover:text-green-600 flex items-center gap-3"
            >
              <span>👨‍🎓</span>
              Assigned Students
            </li>

            {/* Reports */}
            <li
              onClick={() => navigate("/teacher/reports")}
              className="cursor-pointer hover:text-green-600 flex items-center gap-3"
            >
              <span>📊</span>
              Reports & Analytics
            </li>

            {/* Notifications */}
            <li
              onClick={() => navigate("/teacher/notifications")}
              className="cursor-pointer hover:text-green-600 flex items-center gap-3"
            >
              <span>🔔</span>
              Notifications
            </li>

            {/* Logout */}
            <li
              onClick={() => {

                localStorage.clear();

                navigate("/login");

              }}
              className="cursor-pointer text-red-500 mt-8 flex items-center gap-3"
            >
              <span>🚪</span>
              Logout
            </li>

          </ul>

        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>

      </div>
    </>
  );
}
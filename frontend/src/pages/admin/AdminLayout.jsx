import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="flex h-screen bg-gray-100">

        {/* 🔹 Sidebar */}
        <div className="w-64 bg-white shadow-lg p-4">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>

          <ul className="space-y-3">
            <li onClick={() => navigate("/admin")} className="cursor-pointer hover:text-blue-500">
              Dashboard
            </li>

            <li onClick={() => navigate("/admin/students")} className="cursor-pointer hover:text-blue-500">
              Students
            </li>

            <li onClick={() => navigate("/admin/teachers")} className="cursor-pointer hover:text-blue-500">
              Teachers
            </li>

            <li onClick={() => navigate("/admin/deadlines")} className="cursor-pointer hover:text-blue-500">Deadlines</li>
            <li onClick={() => navigate("/admin/assignments")} className="cursor-pointer hover:text-blue-500">Assignments</li>
            <li onClick={() => navigate("/admin/projects")} className="cursor-pointer hover:text-blue-500">Projects</li>
          </ul>
        </div>

        {/* 🔹 Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>

      </div>
    </>
  );
}
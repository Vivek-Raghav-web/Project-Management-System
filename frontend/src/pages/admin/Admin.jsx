import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    projects: 0,
    requests: 0,
  });

  // ✅ Chart Data State
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const studentRes = await API.get("/api/students");
      const teacherRes = await API.get("/api/teachers");

      const students = studentRes.data;
      const teachers = teacherRes.data;

      // ✅ Stats
      setStats({
        students: students.length,
        teachers: teachers.length,
        projects: students.filter((s) => s.project).length,
        requests: students.filter((s) => !s.supervisor).length,
      });

      // ✅ Graph Data
      const projectData = teachers.map((teacher) => {
        const assignedStudents = students.filter(
          (s) => s.supervisor === teacher.name
        );

        return {
          teacher: teacher.name,
          totalProjects: assignedStudents.length,
          students: assignedStudents
            .map((s) => s.name)
            .join(", "),

          projects: assignedStudents
            .map((s) => s.project)
            .join(", "),
        };
      });

      setChartData(projectData);

    } catch (error) {
      console.error("Error fetching stats ❌", error);
    }
  };

  return (
    <>
      {/* 🔹 Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p>
          Manage the entire project management system
        </p>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div
          onClick={() => navigate("/admin/students")}
          className="bg-blue-100 p-4 rounded cursor-pointer hover:scale-105 transition"
        >
          <h4>Total Students</h4>

          <p className="text-xl font-bold">
            {stats.students}
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/teachers")}
          className="bg-green-100 p-4 rounded cursor-pointer hover:scale-105 transition"
        >
          <h4>Total Teachers</h4>

          <p className="text-xl font-bold">
            {stats.teachers}
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded hover:scale-105 transition">
          <h4>Active Projects</h4>

          <p className="text-xl font-bold">
            {stats.projects}
          </p>
        </div>

        <div className="bg-red-100 p-4 rounded hover:scale-105 transition">
          <h4>Pending Requests</h4>

          <p className="text-xl font-bold">
            {stats.requests}
          </p>
        </div>

      </div>

      {/* 🔹 Middle Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* ✅ Graph Section */}
        <div className="col-span-2 bg-white p-4 rounded shadow">

          <h3 className="mb-4 font-semibold">
            Project Distribution
          </h3>

          {/* ✅ Chart */}
          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="teacher" />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    `${value} Projects`,
                    "Assigned",
                  ]}
                  labelFormatter={(label) =>
                    `Teacher: ${label}`
                  }
                />

                <Bar
                  dataKey="totalProjects"
                  fill="#3B82F6"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* ✅ Teacher Details */}
          <div className="mt-4 space-y-3">

            {chartData.map((item, index) => (

              <div
                key={index}
                className="border rounded p-3 bg-gray-50"
              >

                <h4 className="font-semibold text-blue-600">
                  {item.teacher}
                </h4>

                <p>
                  <strong>Total Projects:</strong>{" "}
                  {item.totalProjects}
                </p>

                <p>
                  <strong>Students:</strong>{" "}
                  {item.students || "No Students"}
                </p>

                <p>
                  <strong>Projects:</strong>{" "}
                  {item.projects || "No Projects"}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* 🔹 Recent Activity */}
        <div className="bg-white p-4 rounded shadow">

          <h3 className="mb-2 font-semibold">
            Recent Activity
          </h3>

          <ul className="text-sm space-y-2">
            <li>
              📌 Student requested supervisor
            </li>

            <li>
              📌 New project added
            </li>

            <li>
              📌 Teacher assigned
            </li>

            <li>
              📌 Request approved
            </li>
          </ul>

        </div>

      </div>

      {/* 🔹 Quick Actions */}
      <div className="bg-white p-4 rounded shadow">

        <h3 className="mb-4 font-semibold">
          Quick Actions
        </h3>

        <div className="flex gap-4">

          <button
            onClick={() =>
              navigate("/admin/add-student")
            }
            className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            + Add Student
          </button>

          <button
            onClick={() =>
              navigate("/admin/add-teacher")
            }
            className="flex-1 bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            + Add Teacher
          </button>

          <button
            onClick={() =>
              navigate("/admin/reports")
            }
            className="flex-1 border p-3 rounded hover:bg-gray-100"
          >
            📊 View Reports
          </button>

        </div>

      </div>
    </>
  );
}
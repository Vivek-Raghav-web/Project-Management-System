import { useEffect, useState } from "react";
import API from "../../api";

export default function AssignedStudents() {

  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchNotifications();
  }, []);

  // ✅ Students Fetch
  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/teacher/students");
      setStudents(res.data);
    } catch {
      setStudents([]);
    }
  };

  // ✅ Notifications Fetch
  const fetchNotifications = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/api/teachers/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 👨‍🎓 Sirf assigned student wali notification
      const assignedNotifications = res.data.filter(
        (n) => n.type === "student-assigned"
      );

      setNotifications(assignedNotifications);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      {/* 🔷 Header */}
      {/* 🔷 Header */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">

        <h2 className="text-lg font-semibold">
          Assigned Students
        </h2>

        <p className="text-sm text-gray-500">
          Manage your assigned students and their projects
        </p>

        {/* ✅ TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">

          {/* Total Assigned Students */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">

            <p className="text-sm text-gray-500">
              Assigned Students
            </p>

            <h3 className="text-2xl font-bold text-blue-700 mt-1">
              {notifications.length}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Students assigned to you
            </p>

          </div>

          {/* Total Projects */}
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">

            <p className="text-sm text-gray-500">
              Total Projects
            </p>

            <h3 className="text-2xl font-bold text-purple-700 mt-1">
              {students.length}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Overall student projects
            </p>

          </div>

          {/* Completed */}
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl">

            <p className="text-sm text-gray-500">
              Completed Projects
            </p>

            <h3 className="text-2xl font-bold text-green-700 mt-1">
              {students.filter(s => s.status === "completed").length}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Successfully completed
            </p>

          </div>

          {/* In Progress */}
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">

            <p className="text-sm text-gray-500">
              Admin Progress
            </p>

            <h3 className="text-2xl font-bold text-yellow-700 mt-1">
              {students.filter(
                s =>
                  s.status === "progress" ||
                  s.status === "pending" ||
                  s.status === "admin-progress"
              ).length}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Projects under review
            </p>

          </div>

        </div>

        {/* 🔔 Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-3 mt-6">

            {notifications.map((note) => (

              <div
                key={note._id}
                className={`border rounded-lg p-4 flex items-start gap-3 ${note.isRead
                    ? "bg-gray-50 border-gray-200"
                    : "bg-purple-50 border-purple-200"
                  }`}
              >

                {/* Icon */}
                <div className="text-2xl">
                  👨‍🎓
                </div>

                {/* Content */}
                <div className="flex-1">

                  <div className="flex justify-between items-center">

                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                      Student Assigned
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                  </div>

                  <p className="text-sm text-gray-700 mt-2">
                    {note.message}
                  </p>

                </div>

                {/* Unread Dot */}
                {!note.isRead && (
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

      {/* 🔷 Students List */}
      <div className="bg-white p-6 rounded-lg shadow">

        {students.length > 0 ? (

          <table className="w-full text-left">

            <thead>
              <tr className="border-b">
                <th className="py-2">Student</th>
                <th>Email</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {students.map((s, i) => (

                <tr key={i} className="border-b">

                  <td className="py-2">
                    {s.name}
                  </td>

                  <td>
                    {s.email}
                  </td>

                  <td>
                    {s.project}
                  </td>

                  <td>
                    {s.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <p className="text-center text-gray-500">
            No assigned students found
          </p>

        )}

      </div>

    </div>
  );
}
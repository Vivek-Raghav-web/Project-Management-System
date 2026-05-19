import React, { useEffect, useState } from "react";
import API from "../../api";

export default function StudentAssignments() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 📊 Projects
      const res = await API.get("/api/admin/deadlines", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data);

      // 👨‍🏫 Teachers
      const teacherRes = await API.get("/api/teachers");
      setTeachers(teacherRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 FILTER
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.project.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "assigned"
        ? s.supervisor !== "Not Assigned"
        : s.supervisor === "Not Assigned";

    return matchSearch && matchFilter;
  });

  // ✅ ASSIGN SUPERVISOR
  const handleAssign = async (projectId, teacherId) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/api/admin/assign-supervisor/${projectId}`,
        { teacherId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Assigned ✅");
      fetchData();

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  // 📊 COUNTS
  const assignedCount = students.filter(
    (s) => s.supervisor !== "Not Assigned"
  ).length;

  const unassignedCount = students.filter(
    (s) => s.supervisor === "Not Assigned"
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Top Bar */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by student name or project title..."
          className="w-2/3 p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Students</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <h3 className="mb-4 font-semibold p-4">Students Assignment</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Project Title</th>
              <th className="p-3 text-left">Supervisor</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Updated</th>
              <th className="p-3 text-left">Assign Supervisor</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s._id} className="border-t">
                  
                  <td className="p-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.email}</div>
                  </td>

                  <td className="p-3">{s.project}</td>

                  <td className="p-3">
                    {s.supervisor !== "Not Assigned" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {s.supervisor}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="p-3">{s.deadline || "-"}</td>

                  <td className="p-3">
                    {s.updated
                      ? new Date(s.updated).toLocaleString()
                      : "-"}
                  </td>

                  {/* 👨‍🏫 Dropdown */}
                  <td className="p-3">
                    <select
                      className="border p-2 rounded"
                      onChange={(e) =>
                        handleAssign(s._id, e.target.value)
                      }
                    >
                      <option>Select Supervisor</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Button */}
                  <td className="p-3">
                    <button
                      className={`px-4 py-2 rounded text-white ${
                        s.supervisor !== "Not Assigned"
                          ? "bg-blue-500"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {s.supervisor !== "Not Assigned"
                        ? "Assigned"
                        : "Assign"}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">✔</div>
          <div>
            <div className="text-sm text-gray-500">Assigned Students</div>
            <div className="text-xl font-bold">{assignedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <div className="bg-red-100 text-red-600 p-2 rounded-full">⚠</div>
          <div>
            <div className="text-sm text-gray-500">Unassigned Students</div>
            <div className="text-xl font-bold">{unassignedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">👨‍🏫</div>
          <div>
            <div className="text-sm text-gray-500">Available Teachers</div>
            <div className="text-xl font-bold">{teachers.length}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
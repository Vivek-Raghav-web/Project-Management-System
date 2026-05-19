import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  // 🔥 Fetch Students from Backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students ❌", error);
    }
  };

  // ❌ Delete Student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this student?")) return;

    try {
      await API.delete(`/api/students/${id}`);
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Delete failed ❌", error);
    }
  };

  // 🔍 Filter Logic
  const filteredStudents = students.filter(
    (s) =>
      (s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())) &&
      (department ? s.department === department : true)
  );

  // 📊 Stats
  const totalStudents = students.length;
  const completedProjects = students.filter((s) => s.project).length;
  const unassigned = students.filter((s) => !s.supervisor).length;

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Manage Students</h2>
          <p className="text-sm text-gray-500">
            Add, edit, and manage student accounts
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/add-student")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add New Student
        </button>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-blue-500 text-xl">👥</div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <h3 className="text-lg font-bold">{totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-purple-500 text-xl">✅</div>
          <div>
            <p className="text-sm text-gray-500">Completed Projects</p>
            <h3 className="text-lg font-bold">{completedProjects}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-yellow-500 text-xl">⚠️</div>
          <div>
            <p className="text-sm text-gray-500">Unassigned</p>
            <h3 className="text-lg font-bold">{unassigned}</h3>
          </div>
        </div>
      </div>

      {/* 🔹 Search + Filter */}
      <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          <option value="BCOM">BCOM</option>
          <option value="HM">HM</option>
        </select>
      </div>

      {/* 🔹 Students Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Students List</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th className="py-2">Student Info</th>
              <th>Department & Year</th>
              <th>Supervisor</th>
              <th>Project Title</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                {/* Student Info */}
                <td className="py-3">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-gray-500 text-xs">{s.email}</p>
                </td>

                {/* Department */}
                <td>
                  {s.department}
                  <br />
                  <span className="text-xs text-gray-500">{s.year}</span>
                </td>

                {/* Supervisor */}
                <td>
                  {s.supervisor ? (
                    <span className="text-green-600">{s.supervisor}</span>
                  ) : (
                    <span className="text-red-500 text-xs bg-red-100 px-2 py-1 rounded">
                      Not Assigned
                    </span>
                  )}
                </td>

                {/* Project */}
                <td>{s.project || "-"}</td>

                {/* Actions */}
                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-student/${s._id}`)
                    }
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
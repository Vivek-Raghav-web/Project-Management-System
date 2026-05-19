import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  // 🔥 Fetch Teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/api/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers ❌", error);
    }
  };

  // ❌ Delete Teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this teacher?")) return;

    try {
      await API.delete(`/api/teachers/${id}`);
      fetchTeachers();
    } catch (error) {
      console.error("Delete failed ❌", error);
    }
  };

  // 🔍 Filter
  const filteredTeachers = teachers.filter(
    (t) =>
      (t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase())) &&
      (department ? t.department === department : true)
  );

  // 📊 Stats
  const totalTeachers = teachers.length;
  const totalProjects = teachers.reduce(
    (acc, t) => acc + (t.projects || 0),
    0
  );
  const activeSupervisors = teachers.filter(
    (t) => (t.students || 0) > 0
  ).length;

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Manage Teachers</h2>
          <p className="text-sm text-gray-500">
            Add, edit, and manage teacher accounts
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/add-teacher")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add New Teacher
        </button>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-blue-500 text-xl">👨‍🏫</div>
          <div>
            <p className="text-sm text-gray-500">Total Teachers</p>
            <h3 className="text-lg font-bold">{totalTeachers}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-purple-500 text-xl">📁</div>
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <h3 className="text-lg font-bold">{totalProjects}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <div className="text-yellow-500 text-xl">👥</div>
          <div>
            <p className="text-sm text-gray-500">Active Supervisors</p>
            <h3 className="text-lg font-bold">{activeSupervisors}</h3>
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

      {/* 🔹 Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Teachers List</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th className="py-2">Teacher Info</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Students</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                {/* Info */}
                <td className="py-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.email}</p>
                </td>

                <td>{t.department}</td>
                <td>{t.designation}</td>
                <td>{t.students || 0}</td>
                <td>{t.projects || 0}</td>

                {/* Actions */}
                <td>
                  <button
                    onClick={() => navigate(`/admin/edit-teacher/${t._id}`)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {filteredTeachers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
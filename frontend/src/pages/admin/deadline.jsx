import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function ManageDeadlines() {
  const navigate = useNavigate();
  const [deadlines, setDeadlines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/deadlines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDeadlines(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Search Filter Logic
  const filteredDeadlines = deadlines.filter((d) =>
    (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.project || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.supervisor || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Manage Deadlines</h2>
          <p className="text-sm text-gray-500">
            Create and monitor project deadlines
          </p>
        </div>

        <button 
          onClick={() => navigate("/admin/updateDeadline")} 
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Create/Update Deadline
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search by project, student, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b font-medium text-gray-600">
          Project Deadlines
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Project Title</th>
              <th className="p-3 text-left">Supervisor</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredDeadlines.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              filteredDeadlines.map((d, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.email}</div>
                  </td>

                  <td className="p-3">{d.project}</td>

                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {d.supervisor}
                    </span>
                  </td>

                  <td className="p-3">{d.deadline || "-"}</td>

                  <td className="p-3">
                    {d.updated
                      ? new Date(d.updated).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
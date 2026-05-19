import React, { useEffect, useState } from "react";
import API from "../../api";

export default function DeadlineModal({ onClose, refresh }) {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deadline, setDeadline] = useState("");

  // 🔥 Fetch Data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/deadlines", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API DATA FULL:", res.data);

      // ✅ DIRECT USE (NO FAKE ID)
      setProjects(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 Filter
  const filtered = projects.filter((p) =>
    (p.project || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ SAVE DEADLINE
  const handleSave = async () => {
    console.log("Selected Project FULL:", selectedProject);

    if (!selectedProject || !selectedProject._id) {
      alert("Project ID missing ❌");
      return;
    }

    if (!deadline) {
      alert("Please select deadline ❌");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/api/admin/deadline/${selectedProject._id}`,
        { deadline },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Deadline updated successfully ✅");

      refresh();
      onClose();

    } catch (err) {
      console.error(err);
      alert("Error updating deadline ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
      <div className="bg-white w-[650px] rounded-2xl shadow-xl p-6 relative">
        
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        {/* 🔷 Title */}
        <h2 className="text-xl font-semibold mb-4">
          Create / Update Deadline
        </h2>

        {/* 🔍 Search */}
        <div className="mb-4 relative">
          <label className="text-sm text-gray-600">Search Project</label>

          <input
            type="text"
            placeholder="Search project..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedProject(null);
            }}
            className="w-full mt-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Dropdown */}
          {search && (
            <div className="absolute w-full border mt-1 rounded-lg max-h-40 overflow-y-auto bg-white shadow z-10">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      console.log("Selected:", p);
                      setSelectedProject(p);
                      setSearch(p.project);
                      setDeadline(p.deadline || "");
                    }}
                    className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {p.project}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400 text-sm">
                  No project found
                </div>
              )}
            </div>
          )}
        </div>

        {/* 📅 Deadline */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* 📄 Selected Info */}
        {selectedProject && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-5">
            <p className="font-medium text-gray-700 mb-2">
              {selectedProject.project}
            </p>

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Supervisor</p>
                <p className="font-medium">{selectedProject.supervisor}</p>
              </div>

              <div>
                <p className="text-gray-500">Student</p>
                <p className="font-medium">{selectedProject.name}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {selectedProject.email}
            </p>
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!selectedProject}
            className={`px-5 py-2 rounded-lg text-white ${
              selectedProject
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Deadline
          </button>
        </div>
      </div>
    </div>
  );
}
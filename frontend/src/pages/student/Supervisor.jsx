import { useEffect, useState } from "react";
import API from "../../api";

export default function Supervisor() {

  const [project, setProject] = useState(null);
  const [teachers, setTeachers] = useState([]);

  // 🔥 Fetch project + teachers
  useEffect(() => {
    API.get("/api/student/dashboard")
      .then(res => setProject(res.data.project))
      .catch(() => setProject(null));

    API.get("/api/teachers")
      .then(res => setTeachers(res.data))
      .catch(() => setTeachers([]));
  }, []);

  // 🔥 Request supervisor
  const handleRequest = async (id) => {

  try {

    console.log("========== REQUEST START ==========");

    console.log("Teacher ID:", id);

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const res = await API.post(
      "/api/student/request-supervisor",
      {
        teacherId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ RESPONSE:", res.data);

    console.log("========== REQUEST SUCCESS ==========");

    alert("Request Sent ✅");

  } catch (err) {

    console.log("========== FRONTEND ERROR ==========");

    console.error("Full Error:", err);

    console.error("Response:", err.response);

    console.error("Data:", err.response?.data);

    console.error("Message:", err.message);

    console.log("====================================");

    alert(
      err.response?.data?.error ||
      err.message ||
      "Error ❌"
    );
  }
};

  return (
    <div className="space-y-6">

      {/* Current Supervisor */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Current Supervisor</h2>
        <div className="text-center text-gray-500 py-6 border rounded-lg">
          {project?.supervisor?.name || "Supervisor not assigned yet."}
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Project Details</h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Left */}
          <div>
            <p className="text-sm text-gray-500">PROJECT TITLE</p>
            <h3 className="font-semibold text-gray-800">
              {project?.title || "N/A"}
            </h3>

            <p className="text-sm text-gray-500 mt-4">STATUS</p>
            <span className="inline-block mt-1 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              {project?.status || "Pending"}
            </span>

            <p className="text-sm text-gray-500 mt-4">DESCRIPTION</p>
            <p className="text-sm text-gray-600 mt-1">
              {project?.description || "No description available"}
            </p>
          </div>

          {/* Right */}
          <div>
            <p className="text-sm text-gray-500">DEADLINE</p>
            <p className="text-gray-700">
              {project?.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "No deadline set"}
            </p>

            <p className="text-sm text-gray-500 mt-4">CREATED</p>
            <p className="text-gray-700">
              {project?.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Available Supervisors */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-1">Available Supervisors</h2>
        <p className="text-sm text-gray-500 mb-4">
          Browse and request supervision from available faculty members
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          {teachers.length === 0 ? (
            <p className="text-gray-400">No teachers available</p>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher._id} className="border rounded-xl p-4 hover:shadow transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                    {teacher.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{teacher.name}</h4>
                    <p className="text-sm text-gray-500">{teacher.department}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRequest(teacher._id)}
                  className="w-full bg-blue-500 text-white py-1.5 rounded hover:bg-blue-600 text-sm"
                >
                  Request
                </button>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}
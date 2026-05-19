import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null); // 🔥 USER STATE
  const navigate = useNavigate();

  // 🔥 Fetch logged-in user
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("User fetch error ❌", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      navigate("/login");
      return;
    }

    // 🔥 Fetch user
    fetchUser();

    // 🔥 Fetch dashboard data
    API.get("/api/student/dashboard")
      .then((res) => setData(res.data.project))
      .catch(() => {
        alert("Access Denied");
        localStorage.clear();
        navigate("/login");
      });

  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

        {/* 🔷 Top Welcome Banner */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold">
            Welcome back, {user?.name || "Student"} 👋
          </h2>

          <p className="text-sm opacity-90">
            {user?.email && `Logged in as ${user.email}`}
          </p>
        </div>

        {/* 🔷 Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Project Title</p>
            <h3 className="font-semibold">
              {data?.title || "No Project"}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Supervisor</p>
            <h3 className="font-semibold">
              {data?.supervisor?.name || "N/A"}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Next Deadline</p>
            <h3 className="font-semibold">
              {data?.deadline
                ? new Date(data.deadline).toLocaleDateString()
                : "N/A"}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Recent Feedback</p>
            <h3 className="font-semibold">No feedback yet</h3>
          </div>

        </div>

        {/* 🔷 Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Project Overview */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Project Overview</h3>

            <div className="text-sm text-gray-600 space-y-2">
              <p><b>Title:</b> {data?.title || "N/A"}</p>
              <p><b>Description:</b> {data?.description || "No description provided"}</p>
              <p><b>Status:</b> {data?.status || "Unknown"}</p>
              <p>
                <b>Submission Deadline:</b>{" "}
                {data?.deadline
                  ? new Date(data.deadline).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Latest Feedback */}
          <div className="bg-white p-5 rounded-xl shadow flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Latest Feedback</h3>
              <button className="text-blue-500 text-sm">View All</button>
            </div>

            <div className="text-center text-gray-400">
              No feedback available yet.
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="text-gray-400 text-center">
              No upcoming deadlines yet.
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Recent Notifications</h3>
            <div className="text-gray-400 text-center">
              No notifications yet.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
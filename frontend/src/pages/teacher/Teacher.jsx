import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function Teacher() {

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ COUNTS
  const [assignedStudents, setAssignedStudents] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);

  const navigate = useNavigate();

  // ✅ Fetch Logged In User
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

      console.log("User fetch error ❌", err);

    }

  };

  // ✅ Dashboard Counts Fetch
  const fetchDashboardCounts = async () => {

  try {

    const token = localStorage.getItem("token");

    // 🔔 Notifications Fetch
    const res = await API.get(
      "/api/teachers/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const notifications = res.data;

    console.log("All Notifications:", notifications);

    // ✅ Assigned Students Count
    const assignedStudentsCount = notifications.filter(
      (n) => n.type === "student-assigned"
    ).length;

    // ✅ Pending Requests Count
    const pendingRequestsCount = notifications.filter(
      (n) => n.type === "supervisor-request"
    ).length;

    // ✅ Completed Projects Count
    const completedProjectsCount = notifications.filter(
      (n) => n.type === "project-approved-teacher"
    ).length;

    // ✅ Set States
    setAssignedStudents(assignedStudentsCount);

    setPendingRequests(pendingRequestsCount);

    setCompletedProjects(completedProjectsCount);

  } catch (err) {

    console.log("Dashboard Count Error ❌", err);

  }

};

  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "teacher") {

      navigate("/login");
      return;

    }

    // ✅ Fetch User
    fetchUser();

    // ✅ Fetch Counts
    fetchDashboardCounts();

    // ✅ Dashboard Data
    API.get("/api/teacher", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {

        console.log("Teacher Dashboard:", res.data);

        setData(res.data);

      })
      .catch((err) => {

        console.log("Dashboard Error ❌", err);

        alert("Access Denied");

        localStorage.clear();

        navigate("/login");

      });

  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

        {/* 🔷 Welcome Banner */}
        <div className="bg-green-500 text-white p-6 rounded-xl mb-6 shadow">

          <h2 className="text-2xl font-bold">
            Welcome, {user?.name || "Teacher"} 👋
          </h2>

          <p className="text-sm mt-1 opacity-90">
            {user?.email && `Logged in as ${user.email}`}
          </p>

        </div>

        {/* 🔷 Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* ✅ Assigned Students */}
          <div className="bg-white p-5 rounded-xl shadow border">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Assigned Students
                </p>

                <h3 className="text-3xl font-bold text-blue-600 mt-2">
                  {assignedStudents}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Students assigned to you
                </p>

              </div>

              <div className="bg-blue-100 text-3xl p-4 rounded-xl">
                👨‍🎓
              </div>

            </div>

          </div>

          {/* ✅ Pending Requests */}
          <div className="bg-white p-5 rounded-xl shadow border">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Pending Requests
                </p>

                <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                  {pendingRequests}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Awaiting approval
                </p>

              </div>

              <div className="bg-yellow-100 text-3xl p-4 rounded-xl">
                ⏳
              </div>

            </div>

          </div>

          {/* ✅ Completed Projects */}
          <div className="bg-white p-5 rounded-xl shadow border">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Completed Projects
                </p>

                <h3 className="text-3xl font-bold text-green-600 mt-2">
                  {completedProjects}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Successfully completed
                </p>

              </div>

              <div className="bg-green-100 text-3xl p-4 rounded-xl">
                ✅
              </div>

            </div>

          </div>

        </div>

        {/* 🔷 Recent Activity */}
        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-lg font-semibold mb-2">
            Recent Activity
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Latest notifications and updates
          </p>

          <div className="space-y-4">

            {data?.activities?.length > 0 ? (

              data.activities.map((item, i) => (

                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border"
                >

                  <div>

                    <p className="text-sm text-gray-700">
                      {item.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {item.time}
                    </p>

                  </div>

                  <span className="text-lg">
                    ↗
                  </span>

                </div>

              ))

            ) : (

              <>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">

                  <div>

                    <p className="text-sm text-gray-700">
                      Student requested supervisor assignment.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Just now
                    </p>

                  </div>

                  <span className="text-lg">
                    ↗
                  </span>

                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">

                  <div>

                    <p className="text-sm text-gray-700">
                      New project submitted for review.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Earlier
                    </p>

                  </div>

                  <span className="text-lg">
                    ↗
                  </span>

                </div>
              </>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}
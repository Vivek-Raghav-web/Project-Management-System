import { useEffect, useState } from "react";
import API from "../../api";

export default function TeacherReports() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch Notifications
  const fetchReports = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/api/teachers/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);

    } catch (err) {

      console.log("Report Fetch Error ❌", err);

    } finally {

      setLoading(false);

    }

  };

  // ✅ Filter Counts
  const assignedStudents = notifications.filter(
    (n) => n.type === "student-assigned"
  ).length;

  const pendingRequests = notifications.filter(
    (n) => n.type === "supervisor-request"
  ).length;

  const completedProjects = notifications.filter(
    (n) => n.type === "project-approved-teacher"
  ).length;

  const rejectedProjects = notifications.filter(
    (n) => n.type === "project-rejected-teacher"
  ).length;

  const totalActivities =
    assignedStudents +
    pendingRequests +
    completedProjects +
    rejectedProjects;

  // ✅ Bar Height
  const getHeight = (value) => {

    if (totalActivities === 0) return 40;

    return (value / totalActivities) * 220;

  };

  // ✅ Circle Progress
  const getPercentage = (value) => {

    if (totalActivities === 0) return 0;

    return Math.round((value / totalActivities) * 100);

  };

  if (loading) {

    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <p className="text-gray-400 text-lg">
          Loading Reports...
        </p>
      </div>
    );

  }

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* 🔷 HEADER */}
      {/* ================================================= */}

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow">

        <h2 className="text-3xl font-bold">
          Teacher Reports Dashboard
        </h2>

        <p className="text-sm opacity-90 mt-2">
          Complete analytics overview of projects, students and requests
        </p>

      </div>

      {/* ================================================= */}
      {/* 🔷 TOP STATS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        {/* Assigned */}
        <div className="bg-white rounded-2xl shadow p-5 border border-blue-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Assigned Students
              </p>

              <h3 className="text-4xl font-bold text-blue-600 mt-2">
                {assignedStudents}
              </h3>
            </div>

            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
              👨‍🎓
            </div>

          </div>

        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow p-5 border border-yellow-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Pending Requests
              </p>

              <h3 className="text-4xl font-bold text-yellow-500 mt-2">
                {pendingRequests}
              </h3>
            </div>

            <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
              ⏳
            </div>

          </div>

        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow p-5 border border-green-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Completed Projects
              </p>

              <h3 className="text-4xl font-bold text-green-600 mt-2">
                {completedProjects}
              </h3>
            </div>

            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
              ✅
            </div>

          </div>

        </div>

        {/* Rejected */}
        <div className="bg-white rounded-2xl shadow p-5 border border-red-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Rejected Projects
              </p>

              <h3 className="text-4xl font-bold text-red-500 mt-2">
                {rejectedProjects}
              </h3>
            </div>

            <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">
              ⛔
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* 🔷 BAR GRAPH */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="mb-8">

          <h3 className="text-2xl font-semibold text-gray-800">
            Activity Comparison
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Bar chart analytics representation
          </p>

        </div>

        <div className="h-96 flex items-end justify-around border-l border-b px-6 pb-4">

          {/* Assigned */}
          <div className="flex flex-col items-center">

            <div
              className="w-24 bg-blue-500 rounded-t-2xl transition-all duration-700 hover:scale-105"
              style={{
                height: `${getHeight(assignedStudents)}px`,
              }}
            ></div>

            <p className="mt-4 font-semibold text-gray-700">
              Students
            </p>

            <span className="text-sm text-gray-400">
              {assignedStudents}
            </span>

          </div>

          {/* Pending */}
          <div className="flex flex-col items-center">

            <div
              className="w-24 bg-yellow-400 rounded-t-2xl transition-all duration-700 hover:scale-105"
              style={{
                height: `${getHeight(pendingRequests)}px`,
              }}
            ></div>

            <p className="mt-4 font-semibold text-gray-700">
              Pending
            </p>

            <span className="text-sm text-gray-400">
              {pendingRequests}
            </span>

          </div>

          {/* Completed */}
          <div className="flex flex-col items-center">

            <div
              className="w-24 bg-green-500 rounded-t-2xl transition-all duration-700 hover:scale-105"
              style={{
                height: `${getHeight(completedProjects)}px`,
              }}
            ></div>

            <p className="mt-4 font-semibold text-gray-700">
              Completed
            </p>

            <span className="text-sm text-gray-400">
              {completedProjects}
            </span>

          </div>

          {/* Rejected */}
          <div className="flex flex-col items-center">

            <div
              className="w-24 bg-red-500 rounded-t-2xl transition-all duration-700 hover:scale-105"
              style={{
                height: `${getHeight(rejectedProjects)}px`,
              }}
            ></div>

            <p className="mt-4 font-semibold text-gray-700">
              Rejected
            </p>

            <span className="text-sm text-gray-400">
              {rejectedProjects}
            </span>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* 🔷 CIRCLE GRAPH SECTION */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Progress Cards */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h3 className="text-2xl font-semibold mb-6">
            Performance Ratio
          </h3>

          <div className="space-y-6">

            {/* Assigned */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium">
                  Assigned Students
                </span>

                <span className="text-sm text-blue-600 font-semibold">
                  {getPercentage(assignedStudents)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${getPercentage(assignedStudents)}%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Pending */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium">
                  Pending Requests
                </span>

                <span className="text-sm text-yellow-600 font-semibold">
                  {getPercentage(pendingRequests)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-yellow-400 h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${getPercentage(pendingRequests)}%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Completed */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium">
                  Completed Projects
                </span>

                <span className="text-sm text-green-600 font-semibold">
                  {getPercentage(completedProjects)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${getPercentage(completedProjects)}%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Rejected */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium">
                  Rejected Projects
                </span>

                <span className="text-sm text-red-600 font-semibold">
                  {getPercentage(rejectedProjects)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-red-500 h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${getPercentage(rejectedProjects)}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        </div>

        {/* Donut Style */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">

          <h3 className="text-2xl font-semibold mb-8">
            Overall Activity
          </h3>

          <div className="relative w-64 h-64 rounded-full border-[22px] border-green-500 flex items-center justify-center">

            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-[22px] border-blue-500 rotate-45"></div>

            <div className="absolute top-0 left-0 w-full h-full rounded-full border-r-[22px] border-yellow-400 rotate-12"></div>

            <div className="absolute top-0 left-0 w-full h-full rounded-full border-b-[22px] border-red-500 -rotate-12"></div>

            <div className="text-center">

              <h3 className="text-5xl font-bold text-gray-800">
                {totalActivities}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Total Activities
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 w-full">

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Students</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">Pending</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Rejected</span>
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* 🔷 RECENT ACTIVITIES */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex justify-between items-center mb-6">

          <div>

            <h3 className="text-2xl font-semibold">
              Recent Activities
            </h3>

            <p className="text-sm text-gray-500">
              Latest notifications & updates
            </p>

          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            {notifications.length} Activities
          </div>

        </div>

        <div className="space-y-4">

          {notifications.length > 0 ? (

            notifications.slice(0, 8).map((note) => (

              <div
                key={note._id}
                className="border rounded-xl p-4 flex justify-between items-start hover:bg-gray-50 transition"
              >

                <div>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {note.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>

                </div>

                {!note.isRead && (
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-2 animate-pulse"></div>
                )}

              </div>

            ))

          ) : (

            <div className="text-center py-12">

              <div className="text-5xl mb-3">
                📊
              </div>

              <p className="text-gray-500">
                No activity data available
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
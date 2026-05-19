import { useEffect, useState } from "react";
import API from "../../api";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);

 useEffect(() => {

  const fetchRequests = async () => {

    try {

      console.log("=========== FRONTEND FETCH START ===========");

      // ✅ Token check
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      // ✅ API Call
      const res = await API.get(
        "/api/teachers/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ FULL RESPONSE:", res);

      console.log("✅ RESPONSE DATA:", res.data);

      console.log("✅ TOTAL REQUESTS:", res.data.length);

      // ✅ Empty Check
      if (res.data.length === 0) {

        console.log("❌ No requests found from backend");

        setRequests([
          {
            _id: "demo1",
            studentName: "Vivek Raghav",
            email: "vivek@gmail.com",
            projectTitle: "AI Based Attendance System",
            date: "02 April 2026",
          }
        ]);

      } else {

        console.log("✅ Setting real requests");

        setRequests(res.data);

      }

      console.log("=========== FRONTEND FETCH END ===========");

    } catch (err) {

      console.log("=========== FRONTEND ERROR ===========");

      console.error("FULL ERROR:", err);

      console.error("ERROR RESPONSE:", err.response);

      console.error("ERROR DATA:", err.response?.data);

      console.error("ERROR MESSAGE:", err.message);

      console.log("======================================");

      // 🔥 Demo fallback
      setRequests([
        {
          _id: "demo1",
          studentName: "Vivek Raghav",
          email: "vivek@gmail.com",
          projectTitle: "AI Based Attendance System",
          date: "02 April 2026",
        }
      ]);

    }

  };

  fetchRequests();

}, []);

  const handleAction = (id, action) => {
    API.post(`/api/teachers/requests/${id}`, { action })
      .then(() => {
        setRequests(prev => prev.filter(r => r._id !== id));
      })
      .catch(() => alert("Error updating request"));
  };

  return (
    <div>

      {/* 🔷 Header */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold">
          Pending Supervision Requests
        </h2>
        <p className="text-sm text-gray-500">
          Review and respond to student supervision requests
        </p>

        {/* Search */}
        <div className="mt-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by student name or project title..."
            className="border px-3 py-2 rounded w-1/2"
          />
          <select className="border px-3 py-2 rounded">
            <option>All Requests</option>
          </select>
        </div>
      </div>

      {/* 🔷 Requests List */}
      <div className="space-y-4">

        {requests.length > 0 ? (
          requests.map(req => (
            <div
              key={req._id}
              className="bg-blue-50 border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {req.studentName}
                  <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">
                    Pending
                  </span>
                </h3>

                <p className="text-sm text-gray-500">{req.email}</p>

                <p className="mt-2 font-medium">
                  {req.projectTitle}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Submitted: {req.date}
                </p>

                <p className="text-xs text-gray-400">
                  Supervisor already assigned
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No pending requests
          </p>
        )}

      </div>
    </div>
  );
}
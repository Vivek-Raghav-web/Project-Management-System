import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null); // 🔥 NEW

  useEffect(() => {
    fetchUser();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-900/80 backdrop-blur border-b border-gray-700">
      
      {/* Left Side */}
      <h1 className="text-xl font-bold text-cyan-400">{title}</h1>

      {/* Middle Links */}
      <div className="flex gap-4">

        {role === "admin" && (
          <>
            <button onClick={() => navigate("/student")} className="text-white hover:text-cyan-400">
              Student
            </button>
            <button onClick={() => navigate("/teacher")} className="text-white hover:text-cyan-400">
              Teacher
            </button>
          </>
        )}

        {role === "teacher" && (
          <button onClick={() => navigate("/student")} className="text-white hover:text-cyan-400">
            Student
          </button>
        )}

      </div>

      {/* 🔥 Right Side (Profile + Logout) */}
      <div className="flex items-center gap-4">

        {/* 🔥 PROFILE IMAGE */}
        {user?.profileImage ? (
          <img
            src={`http://localhost:5000/uploads/${user.profileImage}`}
            alt="profile"
            className="w-15 h-15 rounded-full object-cover border-2 "
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}
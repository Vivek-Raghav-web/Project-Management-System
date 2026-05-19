import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/api/auth/register", data);

      alert("OTP sent to your email");

      // ✅ IMPORTANT (Resend OTP ke liye)
      localStorage.setItem("email", data.email);

      // ✅ OTP page pe bhejna
      navigate("/verify-otp", { state: { email: data.email } });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      <div className="bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[380px] border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Register
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />

          <select
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
            onChange={(e) =>
              setData({ ...data, role: e.target.value })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition duration-300 text-black font-semibold"
          >
            Register
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
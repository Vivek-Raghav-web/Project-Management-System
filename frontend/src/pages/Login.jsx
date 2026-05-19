import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // ✅ Check if redirected from Google login
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role = params.get("role");

        if (token && role) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (role === "student") navigate("/student");
            else if (role === "teacher") navigate("/teacher");
            else if (role === "admin") navigate("/admin");
        }
    }, []);

    // Normal login with email/password
    const handleLogin = async () => {
    try {
        localStorage.clear(); // 🔥 FIX (MULTI ROLE ISSUE)

        const res = await API.post("/api/auth/login", data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "student") navigate("/student");
        else if (res.data.role === "teacher") navigate("/teacher");
        else if (res.data.role === "admin") navigate("/admin");

    } catch (err) {
        alert(err.response?.data?.message || "Error");
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[350px] border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
                    Login
                </h2>

                <div className="space-y-4">
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

                    <button
                        onClick={handleLogin}
                        className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition duration-300 text-black font-semibold"
                    >
                        Login
                    </button>
                </div>

                {/* Google Login */}
                <button
                    onClick={() => { window.open("http://localhost:5000/auth/google", "_self"); }}
                    className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold mt-4"
                >
                    Login with Google
                </button>

                <p className="text-gray-400 text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-cyan-400 cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
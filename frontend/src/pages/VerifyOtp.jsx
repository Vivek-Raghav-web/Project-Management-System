import { useState, useEffect } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("email");

  // ⏳ Timer logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Verify OTP
  const handleVerify = async () => {
    try {
      await API.post("/api/auth/verify-otp", { email, otp });
      alert("OTP Verified");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    try {
      await API.post("/api/auth/resend-otp", { email });
      alert("OTP Resent");

      setTimer(60); // reset timer
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-xl w-[350px] text-center">

        <h2 className="text-2xl mb-4 text-cyan-400">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 rounded bg-gray-800 mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-cyan-500 py-2 rounded mb-3"
        >
          Verify
        </button>

        {/* Timer + Resend */}
        {timer > 0 ? (
          <p className="text-gray-400">Resend in {timer}s</p>
        ) : (
          <button
            onClick={handleResend}
            className="text-red-400 underline"
          >
            Resend OTP
          </button>
        )}

      </div>
    </div>
  );
}
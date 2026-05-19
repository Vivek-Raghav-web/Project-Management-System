import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || localStorage.getItem("token");
    const role = urlParams.get("role") || localStorage.getItem("role");

    if (!token || !role) {
      navigate("/login");
      return;
    }

    // Token aur role localStorage me set karo
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Thoda delay do taaki navigate pehle ho jaye
    setTimeout(() => {
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
      else navigate("/login");
    }, 50); // 50ms delay safe hai

  }, [navigate]);

  if (redirecting) {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>;
  }

  return null;
}
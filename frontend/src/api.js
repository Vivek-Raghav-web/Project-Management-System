import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// ✅ Request Interceptor (Token attach)
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Token expired / unauthorized
    if (error.response?.status === 401) {
      alert("Session expired, please login again 🔐");
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    // 🔥 Forbidden (role issue)
    if (error.response?.status === 403) {
      alert("Access denied ❌");
    }

    return Promise.reject(error);
  }
);

export default API;
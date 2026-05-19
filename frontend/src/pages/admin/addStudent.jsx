import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    supervisor: "",
    project: "",
  });

  const [image, setImage] = useState(null); // 🔥 NEW
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.department) {
      alert("Please fill all required fields ⚠️");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(); // 🔥 NEW

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("profileImage", image); // 🔥 IMAGE
      }

      await API.post("/api/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student Added Successfully ✅");

      setForm({
        name: "",
        email: "",
        department: "",
        year: "",
        supervisor: "",
        project: "",
      });

      setImage(null);

      navigate("/admin/students");

    } catch (err) {
      console.error("Error 👉", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-2xl shadow max-w-lg mx-auto">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            Add Student
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input type="text" name="name" value={form.name} placeholder="Student Name"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="email" name="email" value={form.email} placeholder="Email"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="department" value={form.department} placeholder="Department"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="year" value={form.year} placeholder="Year"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="supervisor" value={form.supervisor} placeholder="Supervisor"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="project" value={form.project} placeholder="Project"
              className="w-full border p-2 rounded" onChange={handleChange} />

            {/* 🔥 IMAGE INPUT */}
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
            />

            {image && (
              <p className="text-xs text-green-600">{image.name}</p>
            )}

            <div className="flex gap-3 pt-2">

              <button type="submit" disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                {loading ? "Adding..." : "Submit"}
              </button>

              <button type="button"
                onClick={() => navigate("/admin/students")}
                className="border px-4 py-2 rounded w-full">
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
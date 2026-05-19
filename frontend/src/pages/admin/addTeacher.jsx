import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AddTeacher() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    students: "",
    projects: "",
  });

  const [image, setImage] = useState(null); // 🔥 NEW
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.projects) {
      alert("Please fill all required fields ⚠️");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(); // 🔥 NEW

      // 🔥 APPEND ALL FIELDS
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("profileImage", image); // 🔥 IMAGE
      }

      await API.post("/api/teachers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Teacher Added Successfully ✅");

      setForm({
        name: "",
        email: "",
        department: "",
        designation: "",
        students: "",
        projects: "",
      });

      setImage(null);

      navigate("/admin/teachers");

    } catch (err) {
      console.error("Error 👉", err.response?.data || err.message);
      alert(err.response?.data?.error || "Error adding teacher ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Add Teacher
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input type="text" name="name" value={form.name} placeholder="Teacher Name"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="email" name="email" value={form.email} placeholder="Email"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="department" value={form.department} placeholder="Department"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="text" name="designation" value={form.designation} placeholder="Designation"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="number" name="students" value={form.students} placeholder="Students"
              className="w-full border p-2 rounded" onChange={handleChange} />

            <input type="number" name="projects" value={form.projects} placeholder="Projects"
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
                className="bg-green-500 text-white px-4 py-2 rounded w-full">
                {loading ? "Adding..." : "Submit"}
              </button>

              <button type="button"
                onClick={() => navigate("/admin/teachers")}
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
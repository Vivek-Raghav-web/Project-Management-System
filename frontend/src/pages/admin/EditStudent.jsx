import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    supervisor: "",
    project: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await API.get(`/api/students/${id}`);
      setForm(res.data || {});
    } catch (err) {
      console.error("Fetch error ❌", err);
      alert("Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/api/students/${id}`, form);
      alert("Updated Successfully ✅");
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Student</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input name="name" value={form.name || ""} onChange={handleChange}
          placeholder="Name" className="w-full border p-2 rounded" />

        <input name="email" value={form.email || ""} onChange={handleChange}
          placeholder="Email" className="w-full border p-2 rounded" />

        <input name="department" value={form.department || ""} onChange={handleChange}
          placeholder="Department" className="w-full border p-2 rounded" />

        <input name="year" value={form.year || ""} onChange={handleChange}
          placeholder="Year" className="w-full border p-2 rounded" />

        <input name="supervisor" value={form.supervisor || ""} onChange={handleChange}
          placeholder="Supervisor" className="w-full border p-2 rounded" />

        <input name="project" value={form.project || ""} onChange={handleChange}
          placeholder="Project" className="w-full border p-2 rounded" />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Update Student
        </button>

      </form>
    </div>
  );
}
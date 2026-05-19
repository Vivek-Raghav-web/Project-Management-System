import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    students: "",
    projects: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const res = await API.get(`/api/teachers/${id}`);
      setForm(res.data || {});
    } catch (err) {
      console.error("Error fetching teacher ❌", err);
      alert("Failed to load teacher data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      alert("Name & Email required ⚠️");
      return;
    }

    setUpdating(true);

    try {
      await API.put(`/api/teachers/${id}`, {
        ...form,
        students: Number(form.students || 0),
        projects: Number(form.projects || 0),
      });

      alert("Teacher Updated Successfully ✅");
      navigate("/admin/teachers");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading teacher...</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Edit Teacher
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              value={form.name || ""}
              placeholder="Teacher Name"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              value={form.email || ""}
              placeholder="Email"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              value={form.department || ""}
              placeholder="Department"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            <input
              type="text"
              name="designation"
              value={form.designation || ""}
              placeholder="Designation"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            <input
              type="number"
              name="students"
              value={form.students || ""}
              placeholder="Students"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            <input
              type="number"
              name="projects"
              value={form.projects || ""}
              placeholder="Projects"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            <div className="flex gap-3 pt-2">

              <button
                type="submit"
                disabled={updating}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                {updating ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/teachers")}
                className="border px-4 py-2 rounded w-full"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
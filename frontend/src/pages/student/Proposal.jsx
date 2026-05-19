import { useState } from "react";
import API from "../../api"; // 🔥 add

export default function Proposal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ PEHLE VALIDATION
  if (!title || !description) {
    return alert("All fields required ❌");
  }

  try {
    const res = await API.post("/api/student/proposal", {
      title,
      description
    });

    alert(res.data.message || "Proposal Submitted ✅");

    setTitle("");
    setDescription("");

  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.error || "Error submitting proposal ❌");
  }
};

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      {/* 🔷 Heading */}
      <h2 className="text-xl font-semibold mb-1">
        Submit Proposal
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Please fill out all sections of your project proposal. Make sure to be detailed and clear about your project goals.
      </p>

      {/* 🔷 Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Title
          </label>
          <input
            type="text"
            placeholder="Enter your project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Description
          </label>
          <textarea
            rows="5"
            placeholder="Provide a detailed description of your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Proposal
          </button>
        </div>

      </form>
    </div>
  );
}
import React from "react";

export default function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative">

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>

        {/* Title Field */}
        <div className="mb-3">
          <label className="text-sm text-gray-500">Title</label>
          <div className="p-2 border rounded bg-gray-100">
            {project.title}
          </div>
        </div>

        {/* ✅ SAFE Description */}
        <div className="mb-3">
          <label className="text-sm text-gray-500">Description</label>
          <div className="p-2 border rounded bg-gray-100 text-sm">
            {project.description || "No description available"}
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm text-gray-500">Student</label>
            <div className="p-2 border rounded bg-gray-100">
              {project.student}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Supervisor</label>
            <div className="p-2 border rounded bg-gray-100">
              {project.supervisor || "-"}
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <div className="p-2 border rounded bg-gray-100">
              {project.status}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Deadline</label>
            <div className="p-2 border rounded bg-gray-100">
              {project.deadline || "N/A"}
            </div>
          </div>
        </div>

        {/* ✅ SAFE Files */}
        <div>
          <label className="text-sm text-gray-500">Files</label>
          <ul className="list-disc pl-5 text-sm mt-1">
            {project.files && project.files.length > 0 ? (
              project.files.map((file, i) => (
                <li key={i}>{file}</li>
              ))
            ) : (
              <li>No files uploaded</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
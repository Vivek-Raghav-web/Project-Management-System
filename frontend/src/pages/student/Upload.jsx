import { useEffect, useState } from "react";
import API from "../../api";

export default function StudentUploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Selected files state
  const [report, setReport] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    fetchMyFiles();
  }, []);

  // ✅ Fetch already uploaded files
  const fetchMyFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/student/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload files
  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!report && !presentation && !code) {
      setError("Kam se kam ek file select karo ❌");
      return;
    }

    const formData = new FormData();
    if (report) formData.append("report", report);
    if (presentation) formData.append("presentation", presentation);
    if (code) formData.append("code", code);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      await API.post("/api/student/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Files upload ho gayi ✅");
      setReport(null);
      setPresentation(null);
      setCode(null);

      // Reset file inputs
      document.getElementById("report-input").value = "";
      document.getElementById("presentation-input").value = "";
      document.getElementById("code-input").value = "";

      // Refresh file list
      fetchMyFiles();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Open file
  const handleOpenFile = (fileName) => {
    window.open(`http://localhost:5000/uploads/${fileName}`, "_blank");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* ===================== UPLOAD FORM ===================== */}
      {/* ===================== CARD UPLOAD UI ===================== */}
<div className="flex justify-center items-center mb-10">

  <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

    <h2 className="text-2xl font-bold text-center mb-6">
      📤 Upload Project Files
    </h2>

    <form onSubmit={handleUpload} className="space-y-6">

      {/* Report */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="font-semibold mb-2">📄 Report</p>
        <input
          id="report-input"
          type="file"
          onChange={(e) => setReport(e.target.files[0])}
        />
      </div>

      {/* Presentation */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="font-semibold mb-2">📊 Presentation</p>
        <input
          id="presentation-input"
          type="file"
          onChange={(e) => setPresentation(e.target.files[0])}
        />
      </div>

      {/* Code */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="font-semibold mb-2">💻 Code</p>
        <input
          id="code-input"
          type="file"
          onChange={(e) => setCode(e.target.files[0])}
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
      >
        {uploading ? "Uploading..." : "🚀 Upload Files"}
      </button>

    </form>
  </div>
</div>

      {/* ===================== UPLOADED FILES LIST ===================== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">📂 My Uploaded Files</h2>

        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading... ⏳</p>
        ) : files.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Report</th>
                  <th className="p-3">Presentation</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, index) => (
                  <tr key={f._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{index + 1}</td>

                    <td className="p-3">
                      {f.report ? (
                        <button
                          onClick={() => handleOpenFile(f.report)}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      {f.presentation ? (
                        <button
                          onClick={() => handleOpenFile(f.presentation)}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      {f.code ? (
                        <button
                          onClick={() => handleOpenFile(f.code)}
                          className="text-green-600 underline hover:text-green-800"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6">
            Abhi tak koi file upload nahi ki 📁
          </p>
        )}
      </div>
    </div>
  );
}

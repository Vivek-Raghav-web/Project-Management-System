import { useEffect, useState } from "react";
import API from "../../api";

export default function ViewReports() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/admin/deadlines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFiles(res.data);

    } catch (err) {
      console.error("Error fetching files ❌", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">📂 Student Uploaded Files</h2>

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Report</th>
              <th className="p-3">Presentation</th>
              <th className="p-3">Code</th>
            </tr>
          </thead>

          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-t">

                <td className="p-3">
                  <p className="font-semibold">{f.studentName}</p>
                  <p className="text-xs text-gray-500">{f.email}</p>
                </td>

                <td className="p-3">
                  {f.report ? (
                    <a
                      href={`http://localhost:5000/uploads/${f.report}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  ) : "—"}
                </td>

                <td className="p-3">
                  {f.presentation ? (
                    <a
                      href={`http://localhost:5000/uploads/${f.presentation}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  ) : "—"}
                </td>

                <td className="p-3">
                  {f.code ? (
                    <a
                      href={`http://localhost:5000/uploads/${f.code}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  ) : "—"}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}
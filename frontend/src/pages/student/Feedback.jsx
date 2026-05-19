import { useEffect, useState } from "react";
import API from "../../api";

export default function Feedback() {

  const [feedbacks, setFeedbacks] = useState([]);

  // 🔥 Fetch feedback
  useEffect(() => {
    API.get("/api/student/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(() => setFeedbacks([]));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Feedback</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">
          No feedback yet.
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="border rounded-lg p-4">
              <p className="text-gray-800">{fb.message}</p>

              <div className="text-sm text-gray-500 mt-2 flex justify-between">
                <span>{fb.teacher?.name || "Teacher"}</span>
                <span>
                  {new Date(fb.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../../api";

const typeConfig = {
  "proposal-submitted":   { icon: "📄", bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",    label: "Proposal Submit" },
  "supervisor-assigned":  { icon: "👨‍🏫", bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-700",  label: "Supervisor Assigned" },
  "request-sent":         { icon: "📤", bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",    label: "Request Bheji" },
  "request-accepted":     { icon: "✅", bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-700",  label: "Request Accept" },
  "request-rejected":     { icon: "❌", bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700",      label: "Request Reject" },
  "project-approved":     { icon: "🎉", bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-700",  label: "Project Approved" },
  "project-rejected":     { icon: "⛔", bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700",      label: "Project Rejected" },
  "deadline-update":      { icon: "📅", bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700",label: "Deadline Update" },
  "file-upload":          { icon: "📁", bg: "bg-teal-50",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-700",    label: "File Upload" },
  "feedback-received":    { icon: "💬", bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700",label: "Feedback" },
};

const defaultConfig = { icon: "🔔", bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-600", label: "Update" };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/api/student/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification error ❌", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="text-center py-10 text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} nayi notification` : "Sab caught up!"}
          </p>
        </div>
        {notifications.length > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {notifications.length} total
          </span>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-gray-500 font-medium">Abhi koi notification nahi</p>
          <p className="text-sm text-gray-400 mt-1">
            Project updates, supervisor assignments aur deadlines yahan dikhenge.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => {
            const cfg = typeConfig[note.type] || defaultConfig;
            return (
              <div
                key={note._id}
                className={`border rounded-xl p-4 flex gap-3 items-start ${
                  note.isRead ? "bg-gray-50 border-gray-200" : `${cfg.bg} ${cfg.border}`
                }`}
              >
                <div className="text-xl mt-0.5 flex-shrink-0">{cfg.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      note.isRead ? "bg-gray-200 text-gray-500" : cfg.badge
                    }`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(note.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{note.message}</p>
                </div>

                {!note.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

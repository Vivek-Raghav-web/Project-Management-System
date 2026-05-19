import { useState, useEffect } from "react";
import API from "../../api";
import ProjectDetailsModal from "./projectView";

export default function ProjectsDashboard() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/api/admin/deadlines", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const formatted = res.data.map((p) => ({
                id: p._id,
                title: p.project,
                student: p.name,
                supervisor: p.supervisor,
                deadline: p.deadline || "N/A",
                status: p.status || "pending",
            }));

            setProjects(formatted);

        } catch (err) {
            console.error(err);
        }
    };

    // ✅ APPROVE
    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.put(`/api/admin/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    // ❌ REJECT
    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.put(`/api/admin/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.student.toLowerCase().includes(search.toLowerCase())
    );

    const total = projects.length;
    const pending = projects.filter((p) => p.status === "pending").length;
    const completed = projects.filter((p) => p.status === "approved").length;
    const rejected = projects.filter((p) => p.status === "rejected").length;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">Total Projects</p>
                    <h2 className="text-xl font-bold">{total}</h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-yellow-500">Pending Review</p>
                    <h2 className="text-xl font-bold">{pending}</h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-green-500">Completed</p>
                    <h2 className="text-xl font-bold">{completed}</h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-red-500">Rejected</p>
                    <h2 className="text-xl font-bold">{rejected}</h2>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by project title or student name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-2 border rounded"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-200 text-gray-600 text-sm">
                        <tr>
                            <th className="p-3">PROJECT DETAILS</th>
                            <th className="p-3">STUDENT</th>
                            <th className="p-3">SUPERVISOR</th>
                            <th className="p-3">DEADLINE</th>
                            <th className="p-3">STATUS</th>
                            <th className="p-3">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">
                                    <p className="font-semibold">{p.title}</p>
                                </td>

                                <td className="p-3">{p.student}</td>

                                <td className="p-3 text-green-600">{p.supervisor}</td>

                                <td className="p-3">{p.deadline}</td>

                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-white text-sm ${
                                            p.status === "pending"
                                                ? "bg-yellow-500"
                                                : p.status === "approved"
                                                ? "bg-blue-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {p.status}
                                    </span>
                                </td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => setSelectedProject(p)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>

                                    {p.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(p.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleReject(p.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}
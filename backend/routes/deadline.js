import express from "express";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import Project from "../models/ProposalModel.js";

const router = express.Router();

// ================= 📊 GET ALL DEADLINES =================
router.get(
  "/deadlines",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("studentId", "name email")
        .populate("supervisor", "name");

      const data = projects.map((p) => ({
        _id: p._id.toString(), // ✅ FIX
        name: p.studentId?.name || "N/A",
        email: p.studentId?.email || "N/A",
        project: p.title || "Untitled",
        supervisor: p.supervisor?.name || "Not Assigned",
        deadline: p.deadline ? p.deadline.toISOString().split("T")[0] : "", // ✅ DATE FIX
        updated: p.updatedAt,
      }));

      res.json(data);

    } catch (err) {
      console.error("GET DEADLINES ERROR:", err);
      res.status(500).json({ error: "Failed to fetch data ❌" });
    }
  }
);

// ================= 📄 GET SINGLE PROJECT =================
router.get(
  "/deadline/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const p = await Project.findById(req.params.id)
        .populate("studentId", "name email")
        .populate("supervisor", "name");

      if (!p) {
        return res.status(404).json({ error: "Project not found ❌" });
      }

      const data = {
        _id: p._id.toString(),
        name: p.studentId?.name || "N/A",
        email: p.studentId?.email || "N/A",
        project: p.title || "Untitled",
        supervisor: p.supervisor?.name || "Not Assigned",
        deadline: p.deadline ? p.deadline.toISOString().split("T")[0] : "",
        updated: p.updatedAt,
      };

      res.json(data);

    } catch (err) {
      console.error("GET SINGLE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ================= ✏️ UPDATE DEADLINE =================
router.put(
  "/deadline/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { deadline } = req.body;

      if (!deadline) {
        return res.status(400).json({ error: "Deadline is required ❌" });
      }

      const updated = await Project.findByIdAndUpdate(
        req.params.id,
        {
          deadline: new Date(deadline), // ✅ IMPORTANT FIX
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Project not found ❌" });
      }

      res.json(updated);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ========================================================

export default router;
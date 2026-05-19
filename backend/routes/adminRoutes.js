import express from "express";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import Project from "../models/ProposalModel.js";
import File from "../models/UploadModel.js";
import Notification from "../models/NotificationModel.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

const router = express.Router();


// =====================================================
// 📊 GET ALL PROJECTS + FILES (admin deadlines view)
// =====================================================
router.get("/deadlines", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("studentId", "name email")
      .populate("supervisor", "name email");

    const files = await File.find();

    const data = projects.map((p) => {
      const studentFiles = files.filter(
        (f) => f.studentId?.toString() === p.studentId?._id?.toString()
      );

      let report = "", presentation = "", code = "";
      studentFiles.forEach((f) => {
        if (f.report) report = f.report;
        if (f.presentation) presentation = f.presentation;
        if (f.code) code = f.code;
      });

      return {
        _id: p._id.toString(),
        name: p.studentId?.name || "N/A",
        email: p.studentId?.email || "N/A",
        studentUserId: p.studentId?._id?.toString() || null,
        project: p.title || "Untitled",
        supervisor: p.supervisor?.name || "Not Assigned",
        supervisorEmail: p.supervisor?.email || null,
        deadline: p.deadline ? p.deadline.toISOString().split("T")[0] : "",
        status: p.status || "pending",
        report,
        presentation,
        code,
        updated: p.updatedAt,
      };
    });

    res.json(data);
  } catch (err) {
    console.error("GET deadlines ERROR:", err);
    res.status(500).json({ error: "Failed ❌" });
  }
});


// =====================================================
// ✏️ UPDATE DEADLINE
// =====================================================
router.put("/deadline/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const { deadline } = req.body;
    if (!deadline) return res.status(400).json({ error: "Deadline required ❌" });

    // ✅ returnDocument: 'after' (deprecated { new: true } fix)
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { deadline: new Date(deadline) },
      { returnDocument: "after" }
    ).populate("studentId", "name email");

    if (!updated) return res.status(404).json({ error: "Project not found ❌" });

    // 🔔 Student ko deadline notification
    if (updated.studentId?._id) {
      await Notification.create({
        userId: updated.studentId._id,
        message: `Aapke project "${updated.title}" ki deadline update hui: ${new Date(deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}.`,
        type: "deadline-update",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE deadline ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 👨‍🏫 ASSIGN SUPERVISOR  ✅ Teacher User account dhundh ke notify karo
// =====================================================
router.put("/assign-supervisor/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const { teacherId } = req.body;  // Teacher model _id aata hai frontend se
    if (!teacherId) return res.status(400).json({ error: "Teacher ID required ❌" });

    console.log("👨‍🏫 Assign supervisor - Teacher (Teacher model) ID:", teacherId);

    // ✅ Teacher model se dhundo
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Teacher nahi mila ❌" });

    // ✅ Teacher ka User account email se dhundo
    const teacherUser = await User.findOne({ email: teacher.email, role: "teacher" });

    // ✅ Project update - supervisor field mein Teacher model ID ya User ID?
    // ProposalModel mein supervisor ref: "Teacher" hai isliye Teacher._id store karo
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { supervisor: teacherId },  // Teacher model _id (as per ProposalModel schema)
      { returnDocument: "after" }
    ).populate("studentId", "name email").populate("supervisor", "name email");

    if (!updated) return res.status(404).json({ error: "Project not found ❌" });

    const projectTitle = updated.title || "project";
    const studentName = updated.studentId?.name || "Student";
    const supervisorName = teacher.name;

    // 🔔 STUDENT ko notification - supervisor assign hua
    if (updated.studentId?._id) {
      await Notification.create({
        userId: updated.studentId._id,
        message: `${supervisorName} ko aapke project "${projectTitle}" ka supervisor assign kiya gaya hai.`,
        type: "supervisor-assigned",
      });
      console.log("✅ Student notified:", updated.studentId._id);
    }

    // 🔔 TEACHER ko notification - naya student assign hua
    if (teacherUser) {
      await Notification.create({
        userId: teacherUser._id,
        message: `Aapko ${studentName} ke project "${projectTitle}" ka supervisor assign kiya gaya hai.`,
        type: "student-assigned",
      });
      console.log("✅ Teacher notified:", teacherUser._id);
    } else {
      console.warn("⚠️ Teacher User account nahi mila email:", teacher.email);
    }

    res.json(updated);
  } catch (err) {
    console.error("ASSIGN supervisor ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// ✅ APPROVE PROJECT
// =====================================================
router.put("/approve/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { returnDocument: "after" }
    ).populate("studentId", "name email").populate("supervisor", "name email");

    if (!updated) return res.status(404).json({ error: "Project not found ❌" });

    // 🔔 STUDENT ko approval notification
    if (updated.studentId?._id) {
      await Notification.create({
        userId: updated.studentId._id,
        message: `🎉 Mubarak ho! Aapka project "${updated.title}" admin ne approve kar diya.`,
        type: "project-approved",
      });
      console.log("✅ Student approval notify:", updated.studentId._id);
    }

    // 🔔 TEACHER ko notification (agar assigned hai)
    if (updated.supervisor?.email) {
      const teacherUser = await User.findOne({ email: updated.supervisor.email, role: "teacher" });
      if (teacherUser) {
        await Notification.create({
          userId: teacherUser._id,
          message: `${updated.studentId?.name || "Aapke student"} ka project "${updated.title}" admin ne approve kar diya.`,
          type: "project-approved-teacher",
        });
        console.log("✅ Teacher approval notify:", teacherUser._id);
      }
    }

    res.json(updated);
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// ❌ REJECT PROJECT
// =====================================================
router.put("/reject/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { returnDocument: "after" }
    ).populate("studentId", "name email").populate("supervisor", "name email");

    if (!updated) return res.status(404).json({ error: "Project not found ❌" });

    // 🔔 STUDENT ko rejection notification
    if (updated.studentId?._id) {
      await Notification.create({
        userId: updated.studentId._id,
        message: `Aapka project "${updated.title}" reject ho gaya. Apne supervisor se guidance lo.`,
        type: "project-rejected",
      });
      console.log("✅ Student rejection notify:", updated.studentId._id);
    }

    // 🔔 TEACHER ko notification
    if (updated.supervisor?.email) {
      const teacherUser = await User.findOne({ email: updated.supervisor.email, role: "teacher" });
      if (teacherUser) {
        await Notification.create({
          userId: teacherUser._id,
          message: `${updated.studentId?.name || "Aapke student"} ka project "${updated.title}" admin ne reject kar diya.`,
          type: "project-rejected-teacher",
        });
      }
    }

    res.json(updated);
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;

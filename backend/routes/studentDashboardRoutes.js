import express from "express";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import Project from "../models/ProposalModel.js";
import Request from "../models/Request.js";
import Notification from "../models/NotificationModel.js";
import Feedback from "../models/FeedbackModel.js";
import upload from "../middleware/upload.js";
import File from "../models/UploadModel.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

const router = express.Router();
console.log("🔥 STUDENT DASHBOARD ROUTE LOADED");


// =====================================================
// 📊 GET STUDENT DASHBOARD DATA
// =====================================================
router.get("/dashboard", verifyToken, allowRoles("student"), async (req, res) => {
  try {
    const project = await Project.findOne({ studentId: req.user.id })
      .populate("supervisor", "name email designation department");
    res.json({ project });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 📄 SUBMIT PROPOSAL
// =====================================================
router.post("/proposal", verifyToken, allowRoles("student"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title aur Description required hai ❌" });
    }

    const existing = await Project.findOne({ studentId: req.user.id });
    if (existing) {
      return res.status(400).json({ error: "Aapka proposal already submit ho chuka hai ❌" });
    }

    const project = new Project({
      studentId: req.user.id,
      title,
      description,
    });

    await project.save();

    // 🔔 Student ko notification
    await Notification.create({
      userId: req.user.id,
      message: `Aapka proposal "${title}" successfully submit ho gaya. Admin review karega.`,
      type: "proposal-submitted",
    });

    res.json({ message: "Proposal submitted ✅", project });
  } catch (err) {
    console.error("Proposal error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 👨‍🏫 REQUEST SUPERVISOR  ✅ MAIN FIX
// =====================================================
router.post("/request-supervisor", verifyToken, allowRoles("student"), async (req, res) => {
  try {
    const { teacherId } = req.body;  // Teacher model ka _id aata hai frontend se

    console.log("📨 Supervisor Request aaya:");
    console.log("   Student User ID:", req.user.id);
    console.log("   Teacher (Teacher model) ID:", teacherId);

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID required hai ❌" });
    }

    // ✅ Step 1: Teacher model se record dhundo
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.error("❌ Teacher model mein nahi mila ID:", teacherId);
      return res.status(404).json({ error: "Teacher nahi mila ❌" });
    }
    console.log("   Teacher name:", teacher.name, "| email:", teacher.email);

    // ✅ Step 2: Us teacher ka User account email se dhundo
    const teacherUser = await User.findOne({ email: teacher.email, role: "teacher" });
    if (!teacherUser) {
      console.error("❌ Teacher ka User account nahi mila email:", teacher.email);
      return res.status(404).json({ error: "Teacher ka login account nahi mila. Admin se contact karo ❌" });
    }
    console.log("   Teacher User._id:", teacherUser._id);

    // ✅ Step 3: Student ka project dhundo
    const project = await Project.findOne({ studentId: req.user.id });
    if (!project) {
      return res.status(404).json({ error: "Pehle proposal submit karo ❌" });
    }

    // ✅ Step 4: Duplicate check (Teacher User _id se)
    const existingRequest = await Request.findOne({
      studentId: req.user.id,
      teacherId: teacherUser._id,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Is teacher ko request already bheji ja chuki hai ❌" });
    }

    // ✅ Step 5: Request save (Teacher User _id store karo)
    const request = new Request({
      studentId: req.user.id,
      teacherId: teacherUser._id,  // ✅ User model _id - JWT match karega
      projectId: project._id,
    });
    await request.save();
    console.log("✅ Request saved, _id:", request._id);

    // 🔔 Step 6: TEACHER ko notification
    const studentUser = await User.findById(req.user.id).select("name");
    await Notification.create({
      userId: teacherUser._id,
      message: `${studentUser?.name || "Ek student"} ne aapko supervisor request bheja hai. Project: "${project.title}"`,
      type: "supervisor-request",
    });
    console.log("✅ Teacher notification created, userId:", teacherUser._id);

    // 🔔 Step 7: STUDENT ko confirm notification
    await Notification.create({
      userId: req.user.id,
      message: `Aapki supervisor request ${teacher.name} ko bheji gayi. Response ka wait karo.`,
      type: "request-sent",
    });

    res.json({ message: "Supervisor request bheji gayi ✅" });

  } catch (err) {
    console.error("❌ Request supervisor error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 🔔 GET STUDENT NOTIFICATIONS  ✅ userId field use
// =====================================================
router.get("/notifications", verifyToken, allowRoles("student"), async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 💬 GET STUDENT FEEDBACK
// =====================================================
router.get("/feedback", verifyToken, allowRoles("student"), async (req, res) => {
  try {
    const feedback = await Feedback.find({ studentId: req.user.id })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 📁 UPLOAD PROJECT FILES
// =====================================================
router.post(
  "/upload",
  verifyToken,
  allowRoles("student"),
  upload.fields([
    { name: "report", maxCount: 1 },
    { name: "presentation", maxCount: 1 },
    { name: "code", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const file = new File({
        studentId: req.user.id,
        report: req.files?.report?.[0]?.filename || null,
        presentation: req.files?.presentation?.[0]?.filename || null,
        code: req.files?.code?.[0]?.filename || null,
      });
      await file.save();

      await Notification.create({
        userId: req.user.id,
        message: "Aapki project files successfully upload ho gayi.",
        type: "file-upload",
      });

      res.json({ message: "Files uploaded successfully ✅" });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed ❌" });
    }
  }
);


export default router;

import express from "express";
import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import Notification from "../models/NotificationModel.js";
import Request from "../models/Request.js";
import Project from "../models/ProposalModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// ➕ ADD TEACHER
// =====================================================
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, department, designation, students, projects } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash("123456", 10);
    const profileImage = req.file ? req.file.filename : "";

    const newUser = await User.create({
      name, email,
      password: hashedPassword,
      role: "teacher",
      isVerified: true,
      profileImage,
    });

    const teacher = await Teacher.create({
      name, email, department, designation,
      students: Number(students) || 0,
      projects: Number(projects) || 0,
      profileImage,
    });

    // 🔔 Welcome notification
    await Notification.create({
      userId: newUser._id,
      message: `Welcome ${name}! Aapko teacher add kiya gaya hai. Default password: 123456 (login ke baad change karo).`,
      type: "teacher-added",
    });

    res.json({ message: "Teacher added ✅", defaultPassword: "123456", teacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 🔔 GET TEACHER NOTIFICATIONS  ✅ FIXED
// =====================================================
router.get("/notifications", verifyToken, async (req, res) => {
  try {
    // req.user.id = JWT mein store User._id
    // NotificationModel mein userId field hai
    const notifications = await Notification.find({
      userId: req.user.id,   // ✅ Direct match - bilkul sahi
    }).sort({ createdAt: -1 });

    console.log(`🔔 Teacher ${req.user.id} ke liye ${notifications.length} notifications mili`);
    res.json(notifications);
  } catch (err) {
    console.error("Teacher notification error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 📋 GET PENDING REQUESTS  ✅ teacherId = User._id match
// =====================================================
router.get("/requests", verifyToken, async (req, res) => {
  try {
    // Request model mein teacherId = User._id store hota hai (studentDashboardRoutes se)
    const requests = await Request.find({
      teacherId: req.user.id,   // ✅ JWT User._id
      status: "pending",
    })
      .populate("studentId", "name email")
      .populate("projectId", "title description");

    console.log(`📋 Teacher ${req.user.id} ke pending requests: ${requests.length}`);

    const formatted = requests.map((r) => ({
      _id: r._id,
      studentName: r.studentId?.name || "Unknown",
      email: r.studentId?.email || "",
      projectTitle: r.projectId?.title || "Untitled",
      date: new Date(r.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
      }),
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// ✅ ACCEPT / ❌ REJECT REQUEST
// =====================================================
router.post("/requests/:id", verifyToken, async (req, res) => {
  try {
    const { action } = req.body;

    const request = await Request.findById(req.params.id)
      .populate("studentId", "name email _id")
      .populate("projectId", "title _id");

    if (!request) return res.status(404).json({ error: "Request not found ❌" });

    const projectTitle = request.projectId?.title || "project";
    const studentName = request.studentId?.name || "Student";

    if (action === "accept") {
      request.status = "accepted";

      // Project mein supervisor update karo
      // ProposalModel supervisor ref: Teacher model
      // Lekin yahan req.user.id = User._id hai
      // Isliye Teacher model se dhundo
      const teacherRecord = await Teacher.findOne({ email: req.user.email });

      if (teacherRecord) {
        await Project.findByIdAndUpdate(
          request.projectId._id,
          { supervisor: teacherRecord._id },
          { returnDocument: "after" }
        );
      }

      // 🔔 STUDENT ko accept notification
      if (request.studentId?._id) {
        await Notification.create({
          userId: request.studentId._id,
          message: `Aapki supervisor request accept ho gayi! Project "${projectTitle}" ke liye supervisor assign ho gaya. ✅`,
          type: "request-accepted",
        });
      }

      // 🔔 TEACHER ko confirmation
      await Notification.create({
        userId: req.user.id,
        message: `Aapne ${studentName} ki supervision request accept ki. Project: "${projectTitle}".`,
        type: "request-accepted-teacher",
      });

    } else if (action === "reject") {
      request.status = "rejected";

      // 🔔 STUDENT ko reject notification
      if (request.studentId?._id) {
        await Notification.create({
          userId: request.studentId._id,
          message: `Aapki supervisor request project "${projectTitle}" ke liye reject ho gayi. Doosre teacher se request karo.`,
          type: "request-rejected",
        });
      }
    }

    await request.save();
    res.json({ message: `Request ${action === "accept" ? "accept" : "reject"} ho gayi ✅` });

  } catch (err) {
    console.error("Request action error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 👨‍🎓 GET ASSIGNED STUDENTS  ✅ Teacher User._id se dhundo
// =====================================================
router.get("/students", verifyToken, async (req, res) => {
  try {
    // ProposalModel mein supervisor = Teacher model _id hai
    // req.user.id = User._id
    // Isliye pehle Teacher record dhundo
    const teacherRecord = await Teacher.findOne({ email: req.user.email });

    if (!teacherRecord) {
      console.log("Teacher record nahi mila for email:", req.user.email);
      return res.json([]);
    }

    const projects = await Project.find({ supervisor: teacherRecord._id })
      .populate("studentId", "name email");

    const students = projects.map((p) => ({
      _id: p.studentId?._id,
      name: p.studentId?.name || "N/A",
      email: p.studentId?.email || "N/A",
      project: p.title || "Untitled",
      status: p.status || "pending",
      deadline: p.deadline ? p.deadline.toISOString().split("T")[0] : null,
    }));

    res.json(students);
  } catch (err) {
    console.error("Assigned students error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 💬 SEND FEEDBACK TO STUDENT
// =====================================================
router.post("/feedback", verifyToken, async (req, res) => {
  try {
    const { studentId, message } = req.body;

    if (!studentId || !message) {
      return res.status(400).json({ error: "studentId aur message required hai ❌" });
    }

    // 🔔 Student ko feedback notification
    await Notification.create({
      userId: studentId,
      message: `Aapke supervisor ne feedback diya: "${message.substring(0, 100)}${message.length > 100 ? "..." : ""}"`,
      type: "feedback-received",
    });

    res.json({ message: "Feedback bheji gayi ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 📄 GET ALL TEACHERS
// =====================================================
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📄 GET SINGLE TEACHER
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found ❌" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE TEACHER
router.put("/:id", async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { ...req.body, students: Number(req.body.students || 0), projects: Number(req.body.projects || 0) },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ DELETE TEACHER
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;

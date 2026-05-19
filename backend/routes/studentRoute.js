import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js"; // 🔥 ADD
import Request from "../models/Request.js";
import Notification from "../models/NotificationModel.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import Project from "../models/ProposalModel.js";

const router = express.Router();

// ➕ Add Student with Image
router.post(
  "/",
  upload.single("profileImage"), // 🔥 IMAGE FIELD
  async (req, res) => {
    try {
      const { name, email, department, year, supervisor, project } = req.body;

      // 🔥 CHECK USER EXIST
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists ❌" });
      }

      // 🔐 DEFAULT PASSWORD
      const defaultPassword = "123456";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // 🔥 IMAGE NAME
      const profileImage = req.file ? req.file.filename : "";

      // ✅ CREATE USER
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student",
        isVerified: true,
        profileImage // 🔥 SAVE IMAGE
      });

      // ✅ CREATE STUDENT
      const student = new Student({
        name,
        email,
        department,
        year,
        supervisor,
        project,
        profileImage // 🔥 OPTIONAL (if you want)
      });

      await student.save();

      res.json({
        message: "Student added with image ✅",
        defaultPassword: "123456",
        student
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// बाकी same
router.get("/", async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

router.put("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.post("/request-supervisor", verifyToken, async (req, res) => {
  try {

    console.log("=========== REQUEST START ===========");

    // 🔥 Full request body
    console.log("BODY:", req.body);

    // 🔥 Logged in user
    console.log("USER:", req.user);

    const { teacherId } = req.body;
    const studentId = req.user.id;

    console.log("Student ID:", studentId);
    console.log("Teacher ID:", teacherId);

    // ✅ Find project
    const project = await Project.findOne({
      studentId: studentId
    });

    console.log("PROJECT FOUND:", project);

    // ❌ No project
    if (!project) {

      console.log("❌ PROJECT NOT FOUND");

      return res.status(404).json({
        error: "Project not found ❌"
      });
    }

    // ✅ Create request
    const request = await Request.create({
      studentId,
      teacherId,
      projectId: project._id
    });

    console.log("✅ REQUEST CREATED:", request);

    // 🔔 Create notification
    const notification = await Notification.create({
      userId: teacherId,
      message: "New supervisor request received",
      type: "request"
    });

    console.log("✅ NOTIFICATION CREATED:", notification);

    console.log("=========== REQUEST SUCCESS ===========");

    res.json({
      message: "Request sent ✅",
      request
    });

  } catch (err) {

    console.log("=========== BACKEND ERROR ===========");

    console.error("Error Message:", err.message);

    console.error("Full Error:", err);

    console.error("Stack:", err.stack);

    console.log("=====================================");

    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
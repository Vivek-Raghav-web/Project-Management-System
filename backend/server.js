import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import "./googleAuth.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken, allowRoles } from "./middleware/authMiddleware.js";
import User from "./models/User.js";

// ✅ ROUTES IMPORT
import studentRoutes from "./routes/studentRoute.js";
import teacherRoutes from "./routes/teacherRoute.js";

// ✅ EXISTING
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";

// 🔥 NEW ADD (ADMIN ROUTE)
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());

// ================= AUTH =================
app.use("/api/auth", authRoutes);

// ================= GOOGLE LOGIN =================
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.user.email });

      if (!user) {
        user = await User.create({
          name: req.user.name,
          email: req.user.email,
          role: "student",
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.redirect(
        `http://localhost:5173/?token=${token}&role=${user.role}`
      );
    } catch (err) {
      console.log(err);
      res.send("Error in Google login");
    }
  }
);

// ================= DASHBOARD =================
app.get("/api/student", verifyToken, allowRoles("student"), (req, res) =>
  res.json({ message: "Welcome Student Dashboard" })
);

// ✅ STUDENT ROUTE
app.use("/api/student", studentDashboardRoutes);

// 🔥 ADMIN ROUTE (NEW ADD)
app.use("/api/admin", adminRoutes);

app.get("/api/teacher", verifyToken, allowRoles("teacher"), (req, res) =>
  res.json({ message: "Welcome Teacher Dashboard" })
);

app.get("/api/admin", verifyToken, allowRoles("admin"), (req, res) =>
  res.json({ message: "Welcome Admin Dashboard" })
);

// ================= CRUD ROUTES =================

// 👉 STUDENTS
app.use("/api/students", studentRoutes);

// 👉 TEACHERS
app.use("/api/teachers", teacherRoutes);

// ================= DB =================
mongoose
  .connect("mongodb://localhost:27017/myapp")
  .then(() =>
    app.listen(5000, () =>
      console.log("🚀 Server running on port 5000")
    )
  )
  .catch((err) => console.log(err));
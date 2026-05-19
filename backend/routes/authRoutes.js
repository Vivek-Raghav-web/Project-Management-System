import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/endEmail.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// 📝 REGISTER
// =====================================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name, email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "OTP aapke email par bheja gaya 📩" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// =====================================================
// 🔐 VERIFY OTP
// =====================================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP invalid ya expired hai ❌" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Account verify ho gaya ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// =====================================================
// 🔁 RESEND OTP
// =====================================================
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(email, otp);
    res.json({ message: "OTP dobara bheja gaya 🔁" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// =====================================================
// 🔑 LOGIN  ✅ email bhi JWT mein daalo (teacher lookup ke liye)
// =====================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Pehle email verify karo (OTP) ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password galat hai ❌" });

    // ✅ IMPORTANT: email bhi token mein daalo
    // teacherRoute.js mein req.user.email se Teacher record dhunda jata hai
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,   // ✅ ZARURI - teacher lookup ke liye
        name: user.name,     // ✅ Notifications mein naam use hota hai
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// =====================================================
// 👤 GET LOGGED-IN USER
// =====================================================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found ❌" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


export default router;

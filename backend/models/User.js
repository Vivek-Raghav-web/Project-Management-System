import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },
  profileImage: {
    type: String,
    default: ""
  },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date
});

// ✅ IMPORTANT
export default mongoose.model("User", userSchema);
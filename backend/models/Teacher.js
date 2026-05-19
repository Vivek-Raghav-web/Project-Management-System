import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    students: {
      type: Number,
      default: 0,
    },

    projects: {
      type: Number,
      default: 0,
    },
    },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
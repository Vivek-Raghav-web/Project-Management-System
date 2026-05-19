import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
  {
    // 🔗 Project Reference
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // 🔗 Student Reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 Supervisor
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    // 📅 Deadline Date
    deadline: {
      type: Date,
      required: true,
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },

    // 📝 Optional Notes
    remarks: {
      type: String,
      default: "",
    },

    // 👤 Created By (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Deadline", deadlineSchema);
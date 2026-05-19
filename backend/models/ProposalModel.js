import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  description: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    default: null
  },

  deadline: Date
},
{ timestamps: true }
);

export default mongoose.model("Project", projectSchema);
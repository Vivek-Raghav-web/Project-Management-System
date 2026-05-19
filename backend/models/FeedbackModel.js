import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  },

  message: String
},
{ timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
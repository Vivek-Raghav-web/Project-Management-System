import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  report: String,
  presentation: String,
  code: String
},
{ timestamps: true }
);

export default mongoose.model("File", fileSchema);
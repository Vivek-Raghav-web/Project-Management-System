import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"   // ✅ FIX
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }

    },
    { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
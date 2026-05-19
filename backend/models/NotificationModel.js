import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  userId: {   // 🔥 FIXED (student ya teacher dono ke liye)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: String,
  type: String, // request / assign / approve

  isRead: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
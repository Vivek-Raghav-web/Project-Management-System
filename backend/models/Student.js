import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
      
      
    },

    year: {
      type: Number,
      default: "",
    },

    supervisor: {
      type: String,
      default: "",
    },  

    project: {
      type: String,
      default: "",
    },  
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
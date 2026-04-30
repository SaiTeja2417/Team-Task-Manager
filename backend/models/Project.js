import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdBy: String,
  teamMembers: [
    {
      userId: String,
      role: String,
      addedAt: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
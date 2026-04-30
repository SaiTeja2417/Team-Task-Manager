import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  description: String,
  status: String,
  priority: String,
  assignedTo: String,
  createdBy: String,
  dueDate: String,
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
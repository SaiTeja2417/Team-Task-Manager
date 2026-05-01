import Task from "../models/Task.js";

const format = (doc) => ({
  ...doc._doc,
  id: doc._id
});

export const getTasks = async (req, res) => {
  try {
    const filter = req.query.projectId
      ? { projectId: req.query.projectId }
      : {};

    const tasks = await Task.find(filter);
    res.json(tasks.map(format));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      status,
      dueDate
    } = req.body;

    // 🔥 VALIDATION (VERY IMPORTANT)
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and ProjectId are required" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      status,
      dueDate,
      createdBy: req.user.id
    });

    res.status(201).json(format(task)); // ✅ FIXED
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(format(task));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
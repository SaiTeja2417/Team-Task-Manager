import Task from "../models/Task.js";

const format = (doc) => ({
  ...doc._doc,
  id: doc._id
});

export const getTasks = async (req, res) => {
  const filter = req.query.projectId
    ? { projectId: req.query.projectId }
    : {};

  const tasks = await Task.find(filter);
  res.json(tasks.map(format));
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(format(task));
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(format(task));
};
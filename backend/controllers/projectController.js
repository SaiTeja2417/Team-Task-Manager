import Project from "../models/Project.js";

const format = (doc) => ({
  ...doc._doc,
  id: doc._id
});

export const getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects.map(format));
};

export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.json(format(project));
};

export const updateTeam = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { teamMembers: req.body.teamMembers },
    { new: true }
  );
  res.json(format(project));
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find();

  res.json(users.map(u => ({
    id: u._id,
    name: u.name,
    email: u.email
  })));
};
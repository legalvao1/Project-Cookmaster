const services = require('../services/users');

const createUser = async (req, res) => {
  const user = await services.createUser(req.body, req.path);
  if (user.err) return res.status(user.err.code).json({ message: user.err.message });
  res.status(201).json({ user });
};

const createAdminUser = async (req, res) => {
  const user = await services.createAdminUser(req.body, req.path);
  if (user.err) return res.status(user.err.code).json({ message: user.err.message });
  res.status(201).json({ user });
};

module.exports = {
  createUser,
  createAdminUser,
};

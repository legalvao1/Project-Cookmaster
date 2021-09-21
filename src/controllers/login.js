const service = require('../services/login');

const login = async (req, res) => {
  const token = await service.login(req.body);

  if (token.err) return res.status(token.err.code).json({ message: token.err.message });
  res.status(200).json({ token });
};

module.exports = login;

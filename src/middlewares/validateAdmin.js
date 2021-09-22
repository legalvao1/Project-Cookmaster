const validateAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can register new admins' });
  }
  next();
};

module.exports = validateAdmin;

const jwt = require('jsonwebtoken');

const secret = 'senha-super-secreta';

const validateJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'jwt malformed' });

  try {
    const payload = jwt.verify(token, secret);
    
    req.user = payload.data;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = validateJWT;
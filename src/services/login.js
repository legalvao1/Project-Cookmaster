// const model = require('../models/login');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const secret = 'senha-super-secreta';

const jwtConfiguration = {
  expiresIn: '15m',
  algorithm: 'HS256',
};

const verifyLogin = (email, password) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email || !emailRegex.test(email) || !password) {
    return {
      err: {
        code: '401',
        message: 'All fields must be filled',
      },
    };
  }
  return true;
};

const userIsValid = async (email, password) => {
  const user = await User.getUserEmail(email);
  if (!user || user.password !== password) {
    return {
      err: {
        code: '401',
        message: 'Incorrect username or password',
      },
    };
  }
  return user;
};

const login = async ({ email, password }) => {
  const loginisValid = verifyLogin(email, password);
  if (loginisValid.err) return loginisValid;

  const user = await userIsValid(email, password);
  if (user.err) return user;

  const { _id: id, role } = user;

  const payload = {
    id,
    email: user.email,
    role,
  };
 
  const token = jwt.sign({ data: payload }, secret, jwtConfiguration);
  return token;
};

module.exports = { login };

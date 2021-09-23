const model = require('../models/users');

const verifyUser = (name, email, password) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!name || !email || !emailRegex.test(email) || !password) {
    return {
      err: {
        code: '400',
        message: 'Invalid entries. Try again.',
      },
    };
  }
  return true;
};

const getUserEmail = async (email) => {
  const emailExists = await model.getUserEmail(email);
  if (emailExists) {
    return {
      err: {
        code: '409',
        message: 'Email already registered',
      },
    };
  }
  return true;
};

const verifyRole = (role, path) => {
  if (!role) {
    if (path.includes('admin')) return 'admin';
    return 'user';
  }
  return role;
};

const createUser = async ({ name, email, password, role }, path) => {
  const user = await verifyUser(name, email, password);
  if (user.err) return user;

  const emailIsAvailable = await getUserEmail(email);
  if (emailIsAvailable.err) return emailIsAvailable;

  const userRole = verifyRole(role, path);
 
  const create = await model.create(name, email, password, userRole);
  return create;
};

module.exports = {
  createUser,
};

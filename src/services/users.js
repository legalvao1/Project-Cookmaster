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
  console.log('Aqui');
  const emailExists = await model.getUserEmail(email);
  console.log(emailExists);
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

const createUser = async ({ name, email, password, role }) => {
  const user = await verifyUser(name, email, password);
  console.log(user);
  if (user.err) return user;

  const emailIsAvailable = await getUserEmail(email);
  if (emailIsAvailable.err) return emailIsAvailable;

  const userRole = !role ? 'user' : role;

  const create = await model.create(name, email, password, userRole);
  return create;
};

module.exports = {
  createUser,
};

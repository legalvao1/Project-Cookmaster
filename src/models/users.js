const mongoConnection = require('./connection');

const getUserEmail = async (email) => {
  console.log(email);
  const db = await mongoConnection.getConnection();
  const getEmail = await db.collection('users').findOne({ email });

  return getEmail !== null;
};

const create = async (name, email, password, role) => {
  const db = await mongoConnection.getConnection();
  const { insertedId: _id } = await db.collection('users')
    .insertOne({ name, email, password, role });
  return { _id, name, email, role };
};

module.exports = {
  create,
  getUserEmail,
};

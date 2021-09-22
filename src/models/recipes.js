const mongoConnection = require('./connection');

const create = async ({ name, ingredients, preparation }, userId) => {
  const db = await mongoConnection.getConnection();
  const { insertedId: _id } = await db.collection('recipes')
    .insertOne({ name, ingredients, preparation, userId });
  return { _id, name, ingredients, preparation, userId };
};

module.exports = {
  create,
};
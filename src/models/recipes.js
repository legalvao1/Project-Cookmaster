const mongoConnection = require('./connection');

const create = async ({ name, ingredients, preparation }, userId) => {
  const db = await mongoConnection.getConnection();
  const { insertedId: _id } = await db.collection('recipes')
    .insertOne({ name, ingredients, preparation, userId });
  return { _id, name, ingredients, preparation, userId };
};

const getRecipes = async () => {
  const db = await mongoConnection.getConnection();
  const recipes = await db.collection('recipes').find().toArray();
  return recipes;
};

module.exports = {
  create,
  getRecipes,
};
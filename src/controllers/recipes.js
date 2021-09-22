const service = require('../services/recipes');
const model = require('../models/recipes');

const createRecipe = async (req, res) => {
  const recipe = await service.createRecipe(req.body, req.user);

  if (recipe.err) return res.status(recipe.err.code).json({ message: recipe.err.message });
  res.status(201).json({ recipe });
};

const getRecipes = async (req, res) => {
  const recipes = await model.getRecipes();
  res.status(200).json(recipes);
};

const getRecipeById = async (req, res) => {
  const recipe = await service.getRecipeById(req.params);

  if (recipe.err) return res.status(recipe.err.code).json({ message: recipe.err.message });
  res.status(200).json(recipe);
};

const updateRecipe = async (req, res) => {
  const recipe = await service.updateRecipe(req.params, req.body, req.user);

  if (recipe.err) return res.status(recipe.err.code).json({ message: recipe.err.message });
  res.status(200).json(recipe);
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
};

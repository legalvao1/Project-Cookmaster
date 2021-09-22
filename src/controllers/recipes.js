const service = require('../services/recipes');

const createRecipe = async (req, res) => {
  const recipe = await service.createRecipe(req.body, req.user);

  if (recipe.err) return res.status(recipe.err.code).json({ message: recipe.err.message });
  res.status(201).json({ recipe });
};

module.exports = {
  createRecipe,
};

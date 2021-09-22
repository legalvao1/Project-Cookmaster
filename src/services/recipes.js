const model = require('../models/recipes');

const validateBody = ({ name, ingredients, preparation }) => {
  if (!name || !ingredients || !preparation) {
    return {
      err: {
        code: 400,
        message: 'Invalid entries. Try again.',
      },
    };
  }
  return true;
};

const createRecipe = async (body, user) => {
  const bodyIsValid = validateBody(body);
  if (bodyIsValid.err) return bodyIsValid;

  const recipe = await model.create(body, user.id);
  return recipe;
};

const getRecipeById = async ({ id }) => {
  const recipe = await model.getRecipeById(id);

  if (!recipe) {
    return {
      err: {
        code: 404,
        message: 'recipe not found',
      },
    };
  }
  return recipe;
};

const updateRecipe = async (params, body, user) => {
  const recipeExist = await getRecipeById(params);
  if (recipeExist.err) return recipeExist;

  const bodyIsValid = validateBody(body);
  if (bodyIsValid.err) return bodyIsValid;

  const recipe = await model.update(params.id, body, user.id);
  return recipe;
};

const excludeRecipe = async (params) => {
  const recipeExist = await getRecipeById(params);
  if (recipeExist.err) return recipeExist;

  const recipe = await model.exclude(params.id);
  if (recipe.deletedCount === 1) {
    return recipe;
  }
};

module.exports = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  excludeRecipe,
};

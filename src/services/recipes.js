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

module.exports = {
  createRecipe,
};

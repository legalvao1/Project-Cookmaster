const bodyParser = require('body-parser');
const app = require('./app');
const routes = require('./routes');

const validateJWT = require('../middlewares/validateJWT');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/users', routes.users.createUser);
app.post('/login', routes.login);
app.post('/recipes', validateJWT, routes.recipes.createRecipe);

app.get('/recipes', routes.recipes.getRecipes);
app.get('/recipes/:id', routes.recipes.getRecipeById);

app.put('/recipes/:id', validateJWT, routes.recipes.updateRecipe);

app.delete('/recipes/:id', validateJWT, routes.recipes.excludeRecipe);

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

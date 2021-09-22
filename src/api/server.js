const bodyParser = require('body-parser');
const multer = require('multer');
const app = require('./app');
const routes = require('./routes');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    callback(null, `${req.params.id}.${file.mimetype.split('/')[1]}`);
} });
  
const upload = multer({ storage });

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
app.put('/recipes/:id/image', validateJWT, upload.single('image'), routes.recipes.addImage);

app.delete('/recipes/:id', validateJWT, routes.recipes.excludeRecipe);

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));

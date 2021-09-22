const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const routes = require('./routes');

const storage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const folderName = './src/uploads';
        fs.mkdirSync(folderName, { recursive: true });
        callback(null, folderName);
  },
  filename: (req, file, callback) => {
    callback(null, `${req.params.id}.${file.mimetype.split('/')[1]}`);
} });
  
const upload = multer({ storage });

const validateJWT = require('../middlewares/validateJWT');

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
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

// rota para requisito 10 - para eu poder acessar a imagem da receita salva
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;

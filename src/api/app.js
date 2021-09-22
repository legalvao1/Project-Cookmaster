const express = require('express');
const path = require('path');

const app = express();

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

// rota para requisito 10 - para eu poder acessar a imagem da receita salva
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;

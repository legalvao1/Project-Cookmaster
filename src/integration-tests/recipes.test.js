const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');
const { ObjectId } = require('mongodb');
const fs = require('fs');

describe('POST /recipes', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando token não é enviado', () => {
    let response;
    before(async () => {

          
      response = await chai.request(server).post('/recipes')
        .set('authorization', '')
        .send({ name: 'Receita', ingredients: 'ingredientes', preparation: 'preparo'})
    });

    it('retorna código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" tem o valor "missing auth token"', () => {
      expect(response.body.message).to.be.equals('missing auth token');
    });
  });

  describe('Quando token é inválido', () => {
    let response;
    before(async () => {

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjE0YzlhYWY1NDgxNmU3NDBhZDBlNTJiIiwiZW1haWwiOiJ1c2VyQGVtYWlsLmNvbSJ9LCJpYXQiOjE2MzI0MTAyODcsImV4cCI6MTYzMjQxMTE4N30.6ni59UzoJwldZZWAYcnp-4qM86X3Jbewy3-u4mof';
      
      response = await chai.request(server).post('/recipes')
        .set('authorization', token)
        .send({ name: 'Receita', ingredients: 'ingredientes', preparation: 'preparo'})
    });

    it('retorna código de status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" tem o valor "jwt malformed', () => {
      expect(response.body.message).to.be.equals('jwt malformed');
    });
  });

  describe('Quando não é passado nome, ingredientes e preparo da receita', () => {
    let response;
    before(async () => {

      const userCollection = connectionMock.db('Cookmaster').collection('users')
      await userCollection.insertOne({
        email: 'email@email.com',
        password: 'password-ok'
      })

      //TODO: Fazer login
      const authResponse = await chai.request(server).post('/login').send({
        email: 'email@email.com',
        password: 'password-ok'
      })
      
      const token = authResponse.body.token;
    
      response = await chai.request(server).post('/recipes')
        .set('authorization', token)
        .send({ name: '', ingredients: '', preparation: ''})
    });

      it('retorna código de status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" tem o valor "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equals('Invalid entries. Try again.');
    });
  });

  describe('Quando cadastra uma receita com sucesso', () => {
    let response;
    before(async () => {

      const userCollection = connectionMock.db('Cookmaster').collection('users')
      await userCollection.insertOne({
        email: 'email@email.com',
        password: 'password-ok'
      })

      //TODO: Fazer login
      const authResponse = await chai.request(server).post('/login').send({
        email: 'email@email.com',
        password: 'password-ok'
      })

      
      const token = authResponse.body.token;
    
      response = await chai.request(server).post('/recipes')
        .set('authorization', token)
        .send({ name: 'nome', ingredients: 'ingredientes', preparation: 'preparo'})
    });

    

    it('retorna código de status 400', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "recipe"', () => {
      expect(response.body).to.have.property('recipe');
    });

    it('a propriedade "message" tem o valor "id, name, ingredientes, preparation, userId"', () => {
      expect(response.body.recipe).to.includes.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });
});

describe('GET /recipes', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não tem receitas cadastradas', () => {
    let response;
    before(async () => {
    
      response = await chai.request(server).get('/recipes')
    });

    it('retorna código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array no body', () => {
      expect(response.body).to.be.an('array')
    })
  });

  describe('Quando tem receita cadastrada', () => {
    let response;
    before(async () => {

      const userCollection = connectionMock.db('Cookmaster').collection('recipes')
      await userCollection.insertOne({
        name: 'name',
        ingredientes: 'ingredientes',
        preparation: 'preparo'
      })
   
      response = await chai.request(server).get('/recipes')
    });

      it('retorna código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array no body', () => {
      expect(response.body).to.be.an('array')
    })

    it('O array não está vazio', () => {
      expect(response.body).to.be.not.empty;
    });
  });
});

describe('GET /recipes/:id', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não encontra a receita', () => {
    let response;
    before(async () => {
      const emample_id = '604cb554311d68f491ba5781'
   
      response = await chai.request(server).get(`/recipes/${emample_id}`)
    });

    it('retorna código de status 404', () => {
      expect(response).to.have.status(404);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('a propriedade "message" tem o valor "recipe not found"', () => {
      expect(response.body.message).to.be.equals('recipe not found');
    });
  });

  describe('Quando encontra a receita', () => {
    let response;
    before(async () => {
      const emample_id = '604cb554311d68f491ba5781'

      const userCollection = connectionMock.db('Cookmaster').collection('recipes')
      await userCollection.insertOne({
        _id: ObjectId(emample_id),
        name: 'name',
        ingredients: 'ingredientes',
        preparation: 'preparo'
      })
   
   
      response = await chai.request(server).get(`/recipes/${emample_id}`)
    });

      it('retorna código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.includes.keys('_id', 'name', 'ingredients', 'preparation');
    });
  });
});

describe('PUT /recipes/:id', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando atualiza a receita', () => {
    let response;
    before(async () => {
      const emample_id = '604cb554311d68f491ba5781'

      //TODO: Fazer login
      const authResponse = await chai.request(server).post('/login').send({
        email: 'email@email.com',
        password: 'password-ok'
      })

      const token = authResponse.body.token;
       
      response = await chai.request(server).put(`/recipes/${emample_id}`)
        .set('authorization', token)
        .send({ name: 'nome', ingredients: 'ingredients', preparation: 'preparation'})
    });

    it('retorna código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto incluem as chaves "_id, name, ingredients, preparation, userId"', () => {
      expect(response.body).to.includes.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    });
  });
});

describe('DELETE /recipes/:id', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando deleta a receita', () => {
    let response;
    before(async () => {
      const emample_id = '604cb554311d68f491ba5781'

      //TODO: Fazer login
      const authResponse = await chai.request(server).post('/login').send({
        email: 'email@email.com',
        password: 'password-ok'
      })

      const token = authResponse.body.token;
       
      response = await chai.request(server).delete(`/recipes/${emample_id}`)
        .set('authorization', token)
    });

    it('retorna código de status 204', () => {
      expect(response).to.have.status(204);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto está vazio', () => {
      expect(response.body).to.be.empty;
    });
  });
});

describe('PUT /recipes/:id/images', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando adiciona a imagem a receita', () => {
    let response;
    before(async () => {
      const emample_id = '604cb554311d68f491ba5781'

      //TODO: Fazer login
      const authResponse = await chai.request(server).post('/login').send({
        email: 'email@email.com',
        password: 'password-ok'
      })

      const token = authResponse.body.token;
       /**SOURCE https://www.codementor.io/@seunsomefun/writing-tests-for-image-file-uploads-in-nodejs-1byoggozxw */
      response = await chai.request(server).put(`/recipes/${emample_id}/image`)
        .set('authorization', token)
        .attach('image', fs.readFileSync('/home/leticia/Projetos/sd-010-b-cookmaster/src/uploads/ratinho.jpg'), 'uploads/ratinho.png')
    });

    it('retorna código de status 200', () => {
      console.log(response);
      expect(response).to.have.status(200);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
    })

    it('objeto incluem as chaves "_id, name, ingredients, preparation, userId, image"', () => {
      console.log(response.body);
      expect(response.body).to.includes.keys('_id', 'name', 'ingredients', 'preparation', 'userId', 'image');
    });
  });
});
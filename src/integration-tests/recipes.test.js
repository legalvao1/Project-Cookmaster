const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');

describe('POST /recipes', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
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
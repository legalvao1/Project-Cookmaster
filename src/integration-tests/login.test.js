const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');

describe('POST /api/login', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });


  describe('Quando não é passada pessoa usuária e senha', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/login').send({ email: '', password: ''})
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

    it('a propriedade "message" tem o valor "All fields must be filled"', () => {
      expect(response.body.message).to.be.equals('All fields must be filled');
    });


  });

  describe('Quando pessoa usuária não existe ou senha é inválida', () => {
    let response;

    before(async () => {
      response = await chai.request(server).post('/login').send({
        email: 'fakemail@mail.com',
        password: 'senha-fake'
      })
    })

    it('retorna código de status "401"', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });


    it('a propriedade "message" tem o valor de "Incorrect username or password"', () => {
      expect(response.body.message).to.be.equals("Incorrect username or password");
    })
  });

  describe('Quando login é feito com sucesso', () => {
    let response;

    before(async () => {

      const userCollection = connectionMock.db('Cookmaster').collection('users')
      await userCollection.insertOne({
        email: 'email@email.com',
        password: 'password-ok'
      })

      response = await chai.request(server).post('/login')
        .send({
          email: 'email@email.com',
          password: 'password-ok'
        });
    });

    it('retorna código de status "200"', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "token"', () => {
      expect(response.body).to.have.property('token');
    });

    it('a propriedade "token" não está vazia', () => {
      expect(response.body.token).to.be.not.empty;
    });
  });
})
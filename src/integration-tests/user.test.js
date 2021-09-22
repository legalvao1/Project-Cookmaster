  const sinon = require('sinon');
  const chai = require('chai');
  const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
  const { expect } = chai;
  const { MongoClient } = require('mongodb');
  const { getConnection } = require('./connectionMock');
  const server = require('../api/app');

  describe('POST /users', () => {

  let connectionMock;
  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não é passada pessoa nome, email e senha', () => {
    let response;
    before(async () => {
      response = await chai.request(server).post('/users').send({ name: '', email: '', password: ''})
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

  describe('Quando email já existe no banco', () => {
    let response;

    before(async () => {

      const userCollection = connectionMock.db('Cookmaster').collection('users')
      await userCollection.insertOne({
        name: 'user',
        email: 'email@email.com',
        password: 'password-ok'
      })

      response = await chai.request(server).post('/users')
        .send({
          email: 'email@email.com',
          password: 'password-ok'
        });
    });

    it('retorna código de status "409"', () => {
      expect(response).to.have.status(409);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });


    it('a propriedade "message" tem o valor de "Email already registered"', () => {
      expect(response.body.message).to.be.equals("Email already registered");
    })
  });

  describe('Cadastra um novo usuario com sucesso', () => {
    let response;

    before(async () => {

    response = await chai.request(server).post('/users')
        .send({
          name: 'user',
          email: 'email@email.com',
          password: 'password-ok'
        });
    });

    it('retorna código de status "201"', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "_id, name, email, role"', () => {
      expect(response.body).to.includes.keys('_id', 'name', 'email', 'role');
    });
  });
});
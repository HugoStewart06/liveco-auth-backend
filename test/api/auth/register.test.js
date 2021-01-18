const request = require('supertest');
const app = require('../../../app');
const connection = require('../../../connection');

describe('POST /api/auth/register', () => {
  beforeEach((done) => {
    connection.query('TRUNCATE user', done);
  });
  after(() => {
    connection.close();
    // console.log('tous les tests ont été exécutés');
  });

  it('send empty payload', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('send email&password but empty', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ email: '', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('send invalid email', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ email: 'foobar@foobar', password: 'SomePass' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  // tester enregistrement d'email en doublon, censé renvoyer 409

  // tester le cas où on envoie les bons champs
  it('send correct fields', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ email: 'foobar@example.com', password: 'SomePass' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});

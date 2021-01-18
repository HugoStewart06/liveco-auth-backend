const request = require('supertest');
const app = require('../../../app');
const connection = require('../../../connection');

function testRegister(requestBody, expectedStatus, cb) {
  request(app)
    .post('/api/auth/register')
    .send(requestBody)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(expectedStatus, cb);
}

describe('POST /api/auth/register', () => {
  beforeEach((done) => {
    connection.query('TRUNCATE user', done);
  });
  after(() => {
    connection.close();
    // console.log('tous les tests ont été exécutés');
  });

  it('send empty payload', (done) => {
    testRegister({}, 422, done);
  });

  it('send email&password but empty', (done) => {
    testRegister({ email: '', password: '' }, 422, done);
  });

  it('send invalid email', (done) => {
    testRegister({ email: 'foobar@foobar', password: 'SomePass' }, 422, done);
  });

  // tester enregistrement d'email en doublon, censé renvoyer 409
  it('send sending same email twice', (done) => {
    testRegister(
      { email: 'foobar@example.com', password: 'SomePass' },
      201,
      () => {
        testRegister(
          { email: 'foobar@example.com', password: 'SomePass' },
          409,
          done,
        );
      },
    );
  });

  // tester le cas où on envoie les bons champs
  it('send correct fields', (done) => {
    testRegister(
      { email: 'foobar@example.com', password: 'SomePass' },
      201,
      done,
    );
  });
});

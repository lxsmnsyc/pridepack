import supertest from 'supertest';
import SERVER from '../src/server;
import '../src/routes';



describe('Example', () => {
  it('should have the expected content', (done) => {
    supertest(SERVER)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

import SERVER from '../src/server';
import '../src/routes';

describe('Example', () => {
  it('should have the expected content', async () => {
    const response = await SERVER
      .inject()
      .get('/')
      .headers({
        'Accept': 'application/json',
      });
    expect(response.statusCode).toBe(200);
  });
});

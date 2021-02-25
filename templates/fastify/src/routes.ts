import SERVER from './server';

SERVER.get('/', () => ({
  message: 'Hello World',
}));
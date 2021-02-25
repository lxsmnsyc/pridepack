import SERVER from './server';

SERVER.get('/', async (_, reply) => {
  reply.send({ hello: 'world' })
});

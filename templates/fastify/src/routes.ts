import SERVER from './server';

SERVER.get('/', async (_, reply) => {
  await reply.send({ hello: 'world' });
});

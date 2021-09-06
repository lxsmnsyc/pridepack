import SERVER from '../server';

SERVER.get('/', async (request, reply) => {
  request.log.info('Hello word!');
  await reply.send({ hello: 'world' });
});

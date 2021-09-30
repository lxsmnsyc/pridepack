// ANCHOR Fastify
import fastify, { FastifyInstance } from 'fastify';

// HTTP
import { Server, IncomingMessage, ServerResponse } from 'http';

// Plugins
import cors from 'fastify-cors';
import fastifyHealthcheck from 'fastify-healthcheck';
import fastifyHelmet from 'fastify-helmet';
import fastifyFormBody from 'fastify-formbody';

const SERVER: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

// Helmet
SERVER.register(fastifyHelmet)
  .then(() => {
    SERVER.log.info("Initialized 'fastify-helmet' plugin.");
  }, (error) => {
    SERVER.log.error(error);
  });

// Form Body
SERVER.register(fastifyFormBody)
  .then(() => {
    SERVER.log.info("Initialized 'fastify-formbody' plugin.");
  }, (error) => {
    SERVER.log.error(error);
  });

// CORS
SERVER.register(cors)
  .then(() => {
    SERVER.log.info("Initialized 'fastify-cors' plugin.");
  }, (error) => {
    SERVER.log.error(error);
  });

// Healthceck
SERVER.register(fastifyHealthcheck)
  .then(() => {
    SERVER.log.info("Initialized 'fastify-healthcheck' plugin.");
  }, (error) => {
    SERVER.log.error(error);
  });

export default SERVER;

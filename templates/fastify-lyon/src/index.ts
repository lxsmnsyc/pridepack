// Dotenv
import dotenv from 'dotenv';

// Sentry
import Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

// Fastify
import { FastifyInstance } from 'fastify';

// SERVER
import SERVER from './server';

// ROUTES
import './routes';

// Custom Inits
import './tracer';

// Set current working directory as Global variable
// NOTE: https://docs.sentry.io/platforms/node/typescript/
process.env.CWD = process.cwd();

dotenv.config();

// Initialize Sentry
Sentry.init({ dsn: process.env.SENTRY_DSN });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new RewriteFrames({
      root: process.env.CWD,
    }),
  ],
});

// Exit Handler
interface ITerminateOptions {
  coredump: boolean;
  timeout: number;
}

type TerminateFunction = (code: number, reason: string) => (error: Error) => void;

const terminate = (
  server: FastifyInstance,
  options: ITerminateOptions = { coredump: false, timeout: 1000 },
): TerminateFunction => {
  const exit = () => {
    if (options.coredump) {
      process.abort();
    } else {
      process.exit();
    }
  };

  return (code, reason) => (error) => {
    SERVER.log.info(`Process exiting with code: ${code}, reason ${reason}`);

    if (error && error instanceof Error) {
      SERVER.log.info(error.message, error.stack);
    }

    // Execute graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
};

const exitHandler = terminate(SERVER, {
  coredump: false,
  timeout: 5000,
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('uncaughtRejection', exitHandler(1, 'Unexpected Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));

const PORT = process.env.NODE_ENV === 'development'
  ? process.env.DEV_PORT
  : process.env.PORT;

SERVER.listen(PORT ?? 8080, '0.0.0.0', (error, address) => {
  if (error) {
    SERVER.log.error(error.message);
    process.exit(1);
  }
  SERVER.log.info(`Server listening on ${address}`);
});

import tracer from 'dd-trace';

tracer.init({
  enabled: true,
  service: 'lyon-service-name', // TODO: Change to correct service/repository name
  env: process.env.NODE_ENV,
});

export default tracer;

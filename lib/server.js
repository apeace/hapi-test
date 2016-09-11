const Hapi = require('hapi');

module.exports = function createServer ({
  healthCheck,
  port
}) {

  const server = new Hapi.Server();

  server.connection({port});

  server.route({
    method: 'GET',
    path: '/health-check',
    handler: (request, reply) => {
      reply(healthCheck);
    }
  });

  return server;

};

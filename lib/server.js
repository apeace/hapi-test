const Hapi = require('hapi');

const schemas = require('./schemas');

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

  for (let schema of schemas) {
    server.route({
      method: 'POST',
      path: `/${schema.name}`,
      config: {
        validate: {
          payload: schema.schema
        },
      },
      handler: (request, reply) => {
        // TODO real response
        const response = reply('ok');
        response.code(201);
      }
    });
  }

  return server;

};

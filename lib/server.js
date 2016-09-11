const Hapi = require('hapi');

// TODO move to another file
const Joi = require('joi');
const orgSchema = {
  name: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  url: Joi.string().uri().required(),
  code: Joi.number().integer().required(),
  type: Joi.any().allow(['employer', 'insurance', 'health-system'])
};

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

  server.route({
    method: 'POST',
    path: '/organizations',
    config: {
      validate: {
        payload: orgSchema
      },
    },
    handler: (request, reply) => {
      // TODO real response
      const response = reply('ok');
      response.code(201);
    }
  });

  return server;

};

const Hapi = require('hapi');
const Joi = require('joi');

const schemas = require('./schemas');

module.exports = function createServer ({
  healthCheck,
  port,
  repoConstructor
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
    let repoCtor = repoConstructor;
    if (schema.repoMixin) {
      repoCtor = schema.repoMixin(repoConstructor);
    }
    const repo = new repoCtor(schema.name);

    // CREATE route
    server.route({
      method: 'POST',
      path: `/${schema.name}`,
      config: {
        validate: {
          payload: schema.schema
        },
      },
      handler: (request, reply) => {
        repo.create(request.payload)
          .then(obj => {
            const response = reply(obj)
            response.code(201);
          })
          .catch(errorResponse(reply));
      }
    });

    // READ route (single)
    server.route({
      method: 'GET',
      path: `/${schema.name}/{id}`,
      config: {
        validate: {
          params: {
            id: Joi.number().integer()
          }
        }
      },
      handler: (request, reply) => {
        repo.get(request.params.id)
          .then(obj => {
            if (!obj) {
              const response = reply('Not found');
              response.code(404);
              return;
            }
            const response = reply(obj);
            response.code(200);
          })
          .catch(errorResponse(reply));
      }
    });

    // READ route (list)
    server.route({
      method: 'GET',
      path: `/${schema.name}`,
      config: {
        validate: {
          query: schema.listParams
        }
      },
      handler: (request, reply) => {
        repo.list(request.query)
          .then(objs => {
            const response = reply(objs);
            response.code(200);
          })
          .catch(errorResponse(reply));
      }
    });

    // UPDATE route
    server.route({
      method: 'PUT',
      path: `/${schema.name}/{id}`,
      config: {
        validate: {
          payload: schema.schema,
          params: {
            id: Joi.number().integer()
          }
        },
      },
      handler: (request, reply) => {
        repo.update(request.params.id, request.payload)
          .then(obj => {
            if (!obj) {
              const response = reply('Not found');
              response.code(404);
              return;
            }
            const response = reply(obj)
            response.code(200);
          })
          .catch(errorResponse(reply));
      }
    });

    // DELETE route
    server.route({
      method: 'DELETE',
      path: `/${schema.name}/{id}`,
      config: {
        validate: {
          params: {
            id: Joi.number().integer()
          }
        }
      },
      handler: (request, reply) => {
        repo.remove(request.params.id)
          .then(obj => {
            const response = reply('');
            response.code(204);
          })
          .catch(errorResponse(reply));
      }
    });

  }

  function errorResponse (reply) {
    return err => {
      console.error(err);
      const response = reply('Unknown error');
      response.code(500);
    }
  };

  return server;

};

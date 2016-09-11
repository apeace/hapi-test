const Joi = require('joi');

module.exports = [
  {
    name: 'organizations',

    schema: Joi.object().keys({
      name: Joi.string().max(255).required(),
      description: Joi.string().max(255).required(),
      url: Joi.string().max(255).uri().required(),
      code: Joi.number().integer().required(),
      type: Joi.any().allow(['employer', 'insurance', 'health-system'])
    }),

    listParams: Joi.object().keys({
      code: Joi.number().integer(),
      name: Joi.string().max(255)
    }),

    repoMixin: superclass => class extends superclass {
      // override default list behavior: remove url & code fields
      // unless the code param was included in the request
      list (params) {
        return super.list(params)
          .then(orgs => {
            return orgs.map(org => {
              let cpy = {};
              for (let key in org) {
                if (key === 'url' && !params.code) continue;
                if (key === 'code' && !params.code) continue;
                cpy[key] = org[key];
              }
              return cpy;
            });
          });
      }
    }

  }
];

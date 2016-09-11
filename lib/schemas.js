const Joi = require('joi');

module.exports = [
  {
    name: 'organizations',
    schema: Joi.object().keys({
      name: Joi.string().max(255).required(),
      description: Joi.string().max(255).required(),
      url: Joi.string().uri().required(),
      code: Joi.number().integer().required(),
      type: Joi.any().allow(['employer', 'insurance', 'health-system'])
    }),
    repoMixin: superclass => class extends superclass {
      list (params) {
        return super.list(params)
          .then(orgs => {
            return orgs.map(org => {
              if (!params.url) delete org.url;
              if (!params.code) delete org.code;
              return org;
            });
          });
      }
    }
  }
];

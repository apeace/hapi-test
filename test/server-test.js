const expect = require('chai').expect;

const createServer = require('../lib/server');

describe('Server', () => {

  const server = createServer({
    healthCheck: 'health-check',
    port: 3000
  });

  it('health check', () => {
    return server.inject({
      method: 'GET',
      url: 'localhost:3000/health-check'
    })
    .then(res => {
      expect(res.statusCode).to.eql(200);
      expect(res.payload).to.eql('health-check');
    });
  });

});

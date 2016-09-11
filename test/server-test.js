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

  describe('Organization', () => {

    describe('Create', () => {

      it('Invalid data returns error', () => {
        return server.inject({
          method: 'POST',
          url: 'localhost:3000/organizations',
          payload: {
            name: 'Foo',
            description: 'Bar',
            // invalid URL
            url: 'Baz',
            code: 123,
            type: 'employer'
          }
        })
        .then(res => {
          expect(res.statusCode).to.eql(400);
        });
      });

      it('Valid data returns 201', () => {
        return server.inject({
          method: 'POST',
          url: 'localhost:3000/organizations',
          payload: {
            name: 'Foo',
            description: 'Bar',
            url: 'http://example.com',
            code: 123,
            type: 'employer'
          }
        })
        .then(res => {
          expect(res.statusCode).to.eql(201);
        });
      });

    }); // end Organization > Create

  }); // end Organization

});

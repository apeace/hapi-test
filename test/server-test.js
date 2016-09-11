const expect = require('chai').expect;

const createServer = require('../lib/server');
const MemoryRepo = require('../lib/repos').MemoryRepo;

describe('Server', () => {

  const server = createServer({
    healthCheck: 'health-check',
    port: 3000,
    repoConstructor: MemoryRepo
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

      it('Valid data returns 201 and object', () => {
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
          let payload = JSON.parse(res.payload);
          expect(payload.id).to.eql(1);
        });
      });

    }); // end Organization > Create

    describe('Get single', () => {

      it('Returns saved object', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations/1'
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
          let payload = JSON.parse(res.payload);
          expect(payload).to.eql({
            id: 1,
            name: 'Foo',
            description: 'Bar',
            url: 'http://example.com',
            code: 123,
            type: 'employer'
          });
        });
      });

    }); // end Organization > Get

    describe('List', () => {

      it('Lists objects, without code or url', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations'
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
          let payload = JSON.parse(res.payload);
          expect(payload).to.eql([{
            id: 1,
            name: 'Foo',
            description: 'Bar',
            type: 'employer'
          }]);
        });
      });

      it('Lists objects by code', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations?code=123'
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
          let payload = JSON.parse(res.payload);
          expect(payload).to.eql([{
            id: 1,
            name: 'Foo',
            description: 'Bar',
            type: 'employer',
            code: 123,
            url: 'http://example.com'
          }]);
        });
      });

      it('Lists objects by name', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations?name=Foo'
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
          let payload = JSON.parse(res.payload);
          expect(payload).to.eql([{
            id: 1,
            name: 'Foo',
            description: 'Bar',
            type: 'employer'
          }]);
        });
      });

    }); // end Organization > List

    describe('Update', () => {

      it('Invalid data returns error', () => {
        return server.inject({
          method: 'PUT',
          url: 'localhost:3000/organizations/1',
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

      it('Valid data returns object', () => {
        return server.inject({
          method: 'PUT',
          url: 'localhost:3000/organizations/1',
          payload: {
            name: 'Foo',
            description: 'Bar',
            url: 'http://example2.com',
            code: 123,
            type: 'employer'
          }
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
        });
      });

      it('Updated object returned', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations/1'
        })
        .then(res => {
          expect(res.statusCode).to.eql(200);
          let payload = JSON.parse(res.payload);
          expect(payload).to.eql({
            id: 1,
            name: 'Foo',
            description: 'Bar',
            url: 'http://example2.com',
            code: 123,
            type: 'employer'
          });
        });
      });

    }); // end Organization > Update

    describe('Delete', () => {

      it('Should return 204', () => {
        return server.inject({
          method: 'DELETE',
          url: 'localhost:3000/organizations/1'
        })
        .then(res => {
          expect(res.statusCode).to.eql(204);
        });
      });

      it('Org should return 404', () => {
        return server.inject({
          method: 'GET',
          url: 'localhost:3000/organizations/1'
        })
        .then(res => {
          expect(res.statusCode).to.eql(404);
        });
      });

    }); // end Organization > Delete

  }); // end Organization

});

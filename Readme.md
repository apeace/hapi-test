# hapi-test

Playing with [Hapi.js](http://hapijs.com/) framework.

## TODO

 * Add caching

## Run tests

Install and run tests with:

```
npm install
npm test
```

## Run server

You will need a running MySQL instance.

Configuration is done through environment variables, which
are [listed here](./lib/config.js). Assuming those are set,
start the server with:

```
npm start
```

## Design

The server is designed as a simple RESTful resource API,
using Hapi for routing, and Joi for validation.

The concept of [repositories](./lib/repos) is used to represent
a data-layer abstraction. This way, [tests](./test/server-test.js)
can be written against the API without requiring a running database,
or requiring repetitive/brittle database mocks.

Resources are defined in [schemas.js](./lib/schemas.js),
and can override various methods on repositories. This way, one
repository implementation can be used for tests, one for
production, and all schemas can overwrite methods one time.

## Improvements

Here are ways I would improve this app to make it production-ready.
I didn't do these in the interest of time.

 * Unit-testing for `MySQLRepo` using mocks.
 * Proper MySQL schema definition and migrations.
 * Automate local setup using Docker.

# hapi-test

Playing with [Hapi.js](http://hapijs.com/) framework.

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

You might notice that `MySQLRepo` has some special logic for
reconnecting. The MySQL service I used on Heroku seemed eager to
drop connections, so I hacked this in as an afterthought. In a
real-world app, a proper connection-pooling library would be used.
(Or more likely, an actual ORM that hides connection details).

## Caching

Using Hapi [server method caching](http://hapijs.com/tutorials/caching#server-methods)
looked promising, but after going through some documentation, I
wasn't clear on how cache invalidation was supposed to happen. So
I decided to take advantage of my repository abstraction and roll
my own simple caching mechanism.

Normally I would go with the framework-provided method for caching,
but as a stand-alone caching layer, the `CachingRepo` I built could
use some improvements. For one thing, it has the `name` and `code`
keys hard-coded so that invalidation can be performed properly.

## TODO

 * Handle MySQL & Redis disconnects so the process won't crash
   on Heroku.

## Improvements

Here are ways I would improve this app to make it production-ready.
I didn't do these in the interest of time.

 * Unit-testing for `MySQLRepo` using mocks.
 * Proper MySQL schema definition and migrations.
 * Automate local setup using Docker.
 * Cache layer improvements mentioned above.

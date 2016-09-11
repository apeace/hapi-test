const createServer = require('../lib/server');
const config = require('../lib/config');

const serverCfg = {
  healthCheck: 'health-check',
  port: config.port
};
const server = createServer(serverCfg);

server.start(err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running at ${server.info.uri}`);
  }
});

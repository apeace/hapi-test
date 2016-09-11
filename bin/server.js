const createServer = require('../lib/server');
const config = require('../lib/config');
const MySQLRepo = require('../lib/repos').MySQLRepo;

const serverCfg = {
  healthCheck: 'health-check',
  port: config.port,
  repoConstructor: MySQLRepo
};
const server = createServer(serverCfg);

server.start(err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running at ${server.info.uri}`);
  }
});

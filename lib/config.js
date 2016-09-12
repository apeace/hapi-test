const testMode = process.env.NODE_ENV === 'test';

function env (name, required=true, dfault=undefined) {
  let val = process.env[name];
  if (required && val===undefined) {
    if (dfault !== undefined) {
      val = dfault;
    }
    else if (!testMode) {
      throw new Error(`Missing environment variable ${name}`);
    }
  }
  return val;
}

module.exports = {
  port: env('PORT', true, 8000),
  mysqlHost: env('MYSQL_HOST'),
  mysqlUser: env('MYSQL_USER'),
  mysqlPassword: env('MYSQL_PASSWORD'),
  mysqlDatabase: env('MYSQL_DATABASE'),
  redisHost: env('REDIS_HOST'),
  redisPort: env('REDIS_PORT')
};

const createRedisConnection = require('redis').createClient;

const config = require('../config');
const MySQLRepo = require('./mysql');

const ONE_HOUR = 60 * 60;

let redis;
function redisConnect () {
  if (!redis) {
    redis = createRedisConnection(config.redisUrl);
  }
  return redis;
}

class CachingRepo {

  constructor (name) {
    this.name = name;
    this.repo = new MySQLRepo(name);
    redisConnect();
  }

  create (obj) {
    return new Promise((resolve, reject) => {
      this.repo.create(obj)
        .then(obj => {
          const multi = redis.multi();
          multi.del(`hapitest:list:${this.name}:code::${obj.code}`);
          multi.del(`hapitest:list:${this.name}:name::${obj.name}`);
          multi.del(`hapitest:list:${this.name}:code::${obj.code}:name::${obj.name}`);
          multi.exec(() => {
            resolve(obj);
          });
        });
    });
  }

  get (id) {
    const key = `hapitest:obj:${this.name}:${id}`;
    return new Promise((resolve, reject) => {
      redis.hgetall(key, (err, res) => {
        if (err) return reject(err);
        else if (res) return resolve(res);
        this.repo.get(id)
          .then(obj => {
            const multi = redis.multi();
            multi.hmset(key, obj);
            multi.expire(key, ONE_HOUR);
            multi.exec(() => {
              resolve(obj);
            });
          });
      });
    });
  }

  list (params) {
    const key = `hapitest:list:${this.name}:` + (Object.keys(params).sort().map(paramKey => {
      return `${paramKey}::${params[paramKey]}`;
    }).join(':'));
    return new Promise((resolve, reject) => {
      redis.get(key, (err, res) => {
        if (err) return reject(err);
        else if (res) return resolve(JSON.parse(res));
        this.repo.list(params)
          .then(objs => {
            const json = JSON.stringify(objs);
            const multi = redis.multi();
            multi.set(key, json);
            multi.expire(key, ONE_HOUR);
            multi.exec(() => {
              resolve(objs);
            });
          });
      });
    });
  }

  update (id, params) {
    return new Promise((resolve, reject) => {
      this.repo.update(id, params)
        .then(obj => {
          const multi = redis.multi();
          multi.del(`hapitest:obj:${this.name}:${id}`);
          multi.del(`hapitest:list:${this.name}:code::${obj.code}`);
          multi.del(`hapitest:list:${this.name}:name::${obj.name}`);
          multi.del(`hapitest:list:${this.name}:code::${obj.code}:name::${obj.name}`);
          multi.exec(() => {
            resolve(obj);
          });
        });
    });
  }

  remove (id) {
    return new Promise((resolve, reject) => {
      this.repo.get(id)
        .then(obj => {
          const multi = redis.multi();
          multi.del(`hapitest:obj:${this.name}:${id}`);
          multi.del(`hapitest:list:${this.name}:code::${obj.code}`);
          multi.del(`hapitest:list:${this.name}:name::${obj.name}`);
          multi.del(`hapitest:list:${this.name}:code::${obj.code}:name::${obj.name}`);
          multi.exec(() => {
            this.repo.remove(id).then(resolve);
          });
        });
    });
  }

}

module.exports = CachingRepo;

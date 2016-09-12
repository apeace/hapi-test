const createMysqlConnection = require('mysql').createConnection;

const config = require('../config');

let mysql;
function mysqlConnect () {
  if (!mysql) {
    mysql = createMysqlConnection({
      host: config.mysqlHost,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      database: config.mysqlDatabase
    });
  }
  mysql.on('error', e => {
    if (e && e.code === 'PROTOCOL_CONNECTION_LOST') {
      mysql = undefined;
    }
    else throw e;
  });
  return mysql;
}

class MySQLRepo {

  constructor (name) {
    this.table = name;
    mysqlConnect();
  }

  create (obj) {
    mysqlConnect();
    let query = `INSERT INTO ${this.table} SET ?`;
    return new Promise((resolve, reject) => {
      mysql.query(query, obj, (err, result) => {
        if (err) reject(err);
        else {
          obj.id = result.insertId;
          resolve(obj);
        }
      });
    });
  }

  get (id) {
    mysqlConnect();
    let query = `SELECT * FROM ${this.table} WHERE id = ?`;
    let params = [id];
    return new Promise((resolve, reject) => {
      mysql.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0] || null);
      });
    });
  }

  list (params) {
    mysqlConnect();
    let query = `SELECT * FROM ${this.table}`;
    let whereClauses = [];
    let paramValues = [];
    for (let key in params) {
      whereClauses.push(`${key} = ?`);
      paramValues.push(params[key]);
    }
    if (whereClauses.length) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    return new Promise((resolve, reject) => {
      mysql.query(query, paramValues, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  update (id, params) {
    mysqlConnect();
    let query = `UPDATE ${this.table} SET ? WHERE id = ?`;
    let paramValues = [params, id];
    return new Promise((resolve, reject) => {
      mysql.query(query, paramValues, err => {
        if (err) reject(err);
        else {
          this.get(id).then(resolve).catch(reject);
        }
      });
    });
  }

  remove (id) {
    mysqlConnect();
    let query = `DELETE FROM ${this.table} WHERE id = ?`;
    let params = [id];
    return new Promise((resolve, reject) => {
      mysql.query(query, params, err => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

}

module.exports = MySQLRepo;

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
  return mysql;
}

class MySQLRepo {

  constructor (name) {
    this.table = name;
    mysqlConnect();
  }

  get (id) {
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

}

module.exports = MySQLRepo;

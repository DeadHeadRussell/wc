import {getDb, events} from './db';

export default class Store {
  constructor(db) {
    if (!this.name) {
      throw new Error('`name` must be provided');
    }

    if (!Array.isArray(this.columns) || this.columns.length == 0) {
      throw new Error('`keys` must be provided');
    }

    this.cache = {};
    this.db = db;
    this.db.run(this.constructCreateSql(), err => {
      if (err) {
        console.error(`Could not create table '${this.name}'`, err);
        process.exit(-1);
      }
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (this.cache[id]) {
        return resolve(this.cache[id]);
      }

      this.db.get(this.getSql(), {$id: id}, (err, row) =>
          err ? reject(err) : resolve(row));
    });
  }

  getAll(params) {
    return new Promise((resolve, reject) => {
      if (this.cache.all) {
        return resolve(this.cache.all);
      }

      this.db.all(this.allSql(params), this.toQueryParams(params), (err, rows) =>
          err ? reject(err) : resolve(rows));
    });
  }

  create(params) {
    delete this.cache.all;
    return new Promise((resolve, reject) => {
      this.db.run(this.createSql(), this.toQueryParams(params), function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }

  update(id, values) {
    delete this.cache.all;
    delete this.cache[id];
    return new Promise((resolve, reject) => {
      this.db.run(this.updateSql(values), this.toQueryParams({}, id), err =>
          err ? reject(err) : resolve());
    });
  }

  toQueryParams(params, id) {
    params = params || {};

    let queryParams = Object.keys(params).reduce((query, param) => {
      query[`$${param}`] = params[param];
      return query;
    }, {});

    if (id) {
      queryParams.$id = id;
    }

    return queryParams;
  }

  constructCreateSql() {
    let sql = `CREATE TABLE IF NOT EXISTS ${this.name} (${this.columns.join(', ')}`;

    if (Array.isArray(this.foreignKeys)) {
      sql += ', ';
      let keys = this.foreignKeys.map(key => `FOREIGN KEY(${key}) REFERENCES ${key}(id)`);
      sql += keys.join(', ');
    }

    sql += ')';

    return sql;
  }

  getSql() {
    return `SELECT ${this.colSplat} FROM ${this.name} WHERE id=$id`;
  }

  allSql(params) {
    if (params) {
      let colQuery = Object.keys(params).map(col => `${col}=$${col}`);
      return `SELECT ${this.colSplat} FROM ${this.name} WHERE ${colQuery.join(' AND ')}`;
    } else {
      return `SELECT ${this.colSplat} FROM ${this.name}`;
    }
  }

  createSql() {
    let cols = this.columns.map(col => col.split(' ', 1)[0]);
    let values = cols.map(col => `$${col}`);

    return `INSERT INTO ${this.name} (${cols.join(', ')}) VALUES (${values.join(', ')})`;
  }

  updateSql(values) {
    let colQuery = Object.keys(values).map(col => `${col}=$${values[col]}`);
    return `UPDATE ${this.name} SET ${colQuery.join(', ')} WHERE id=$id`;
  }

  get colSplat() {
    return ['ROWID as id'].concat(this.columns.map(col => col.split(' ', 1)[0]));
  }
}


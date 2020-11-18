const mysql = require('mysql');
const util = require('util');

// configs database here
const MYSQL_HOST = "localhost";
const MYSQL_USER = "root";
const MYSQL_PASS = "jaringan";
const MYSQL_DB = "login_api";

var _db;

function createDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    }
}

function initDb() {
    _db = createDb({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS,
        database: MYSQL_DB
    });
}

module.exports = {
    initDb: initDb,
    getDb: () => { return _db }
}
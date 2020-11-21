const mysql = require('mysql');
const util = require('util');

// configs database here
const MYSQL_HOST = "localhost";
const MYSQL_USER = "root";
const MYSQL_PASS = "jaringan";
const MYSQL_DB = "login_api";
const MYSQL_TABLE = "user";

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
    
    _db.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`).then(res => {
        _db.query(`
            CREATE TABLE IF NOT EXISTS user (
                id int AUTO_INCREMENT PRIMARY KEY,
                username varchar(255),
                password varchar(255)
            )
            SELECT 'admin' AS \`username\`, 'seblak' AS \`password\`
        `).then(ress => {
            if (ress.warningCount == 0) {
                console.log(`Table ${MYSQL_TABLE} does not exists, creating tables`);
                console.log('Creating user with username "admin" and password "seblak"')
            }
        })
    })
}

module.exports = {
    initDb: initDb,
    getDb: () => { return _db }
}
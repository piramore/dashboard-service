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

async function initDb() {
    _db = createDb({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS
    });

    const databaseRequest = await _db.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);
    if (databaseRequest.warningCount == 0) console.log(`Database does not exists, creating database with name ${MYSQL_DB}`);
    await _db.query(`USE ${MYSQL_DB}`);

    const tableRequest = await _db.query(`
        CREATE TABLE IF NOT EXISTS ${MYSQL_TABLE} (
            id int AUTO_INCREMENT PRIMARY KEY,
            username varchar(255),
            password varchar(255)
        )
        SELECT 'admin' AS \`username\`, 'seblak' AS \`password\`
    `);
    if (tableRequest.warningCount == 0) {
        console.log(`Table does not exists, creating table with name ${MYSQL_TABLE}`);
        console.log(`Creating user with username "admin" and password "seblak"`);
    }
}

module.exports = {
    initDb: initDb,
    getDb: () => { return _db }
}
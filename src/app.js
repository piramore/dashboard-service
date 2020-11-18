const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const parser = require('body-parser');
const util = require('util');

const app = express();
app.use(cors());
app.use(parser.json());

function makeDB(config) {
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

const conn = makeDB({
    host: "localhost",
    user: "root",
    password: "jaringan",
    database: "login_api"
});

app.get('/', (req, res) => {
    res.send({ message: "Hello, world!" });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // verify if request have username and password on body
    if (!username || !password) {
        return res.status(400).send({ success: false, message: "Please provice username and password!" });
    }

    try {
        const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

        // verify if username exists
        if (!users.length) return res.status(403).send({ success: false, message: "User not found!" });

        // verify password
        if (password == users[0].password) {
            return res.send({ success: true, data: users[0], message: "Login success!" });
        }
        else {
            return res.send({ success: false, message: "Wrong password!" });
        }
    }

    catch(err) {
        res.status(500).send({ success: false, error: err });
    }
});

app.post('/changeuser', async (req, res) => {
    const { username, password, new_username } = req.body;

    // verify if request body have username, password, and new username
    if (!username || !password || !new_username) {
        return res.status(400).send({ success: false, message: "Please provide complete data" });
    }

    try {
        const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

        // verify if username exists
        if (!users.length) {
            return res.status(403).send({ success: false, message: "Wrong username" });;
        }

        // verify if password is correct
        if (password != users[0].password) {
            return res.send({ success: false, message: "Wrong password" });
        }

        try {
            // updating username
            const update_query = await conn.query(`UPDATE user SET username="${new_username}" WHERE username="${username}"`);
            return res.json({ success: true, message: "Username updated!" });
        }
        catch(err) {
            return res.status(500).json({ success: false, message: "Failed update username", error: err });
        }
    }

    catch(err) {
        return res.status(500).send({ success: false, error: err });
    }
});

app.post('/changepassword', async (req, res) => {
    const { username, password, new_password } = req.body;

    // verify if request body have username, password, and new password
    if (!username || !password || !new_password) {
        return res.status(400).json({ success: false, message: "Please provide complete data" });
    }

    try {
        const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

        // verify if username is exists
        if (!users.length) return res.status(403).json({ success: false, message: "Wrong username" });

        // verify if password is correct
        if (password != users[0].password) return res.status(403).json({ success: false, message: "Wrong old password!" });
        
        try {
            // updating password
            const update_query = await conn.query(`UPDATE user SET password="${new_password}" WHERE username="${username}"`);
            return res.json({ success: true, message: "Password updated!" });
        }
        catch (err) {
            return res.status(500).json({ success: false, error: err });
        }
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

app.listen(3000, () => console.log("Listening to port 3000"));
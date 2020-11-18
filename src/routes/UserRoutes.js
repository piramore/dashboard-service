const database = require('../configs/Mysql');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // verify if request have username and password on body
    if (!username || !password) {
        return res.status(400).send({ success: false, message: "Please provice username and password!" });
    }

    try {
        const conn = database.getDb();
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

router.post('/updateUsername', async (req, res) => {
    const { username, password, new_username } = req.body;

    // verify if request body have username, password, and new username
    if (!username || !password || !new_username) {
        return res.status(400).send({ success: false, message: "Please provide complete data" });
    }

    try {
        const conn = database.getDb();
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

router.post('/updatePassword', async (req, res) => {
    const { username, password, new_password } = req.body;

    // verify if request body have username, password, and new password
    if (!username || !password || !new_password) {
        return res.status(400).json({ success: false, message: "Please provide complete data" });
    }

    try {
        const conn = database.getDb();
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

router.post('/insertUser', async (req, res) => {
    const { username, password } = req.body;

    // validating if username and password exists in request body
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide complete data" });
    }

    try {
        const conn = database.getDb();

        // check if username already exists
        const users = await conn.query(`SELECT username FROM user WHERE username="${username}"`);
        if (users.length) {
            return res.status(403).json({ success: false, message: "Username already exists." });
        }

        // insert new user into database
        const insertRequest = await conn.query(`INSERT INTO user (username, password) VALUES ("${username}", "${password}")`);
        return res.json({ success: true, message: "Success inserting user!", data: insertRequest });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
})

module.exports = router;
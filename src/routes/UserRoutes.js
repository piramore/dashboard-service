// const database = require('../configs/Mysql');
const { UserModel } = require('../schemas/Schemas');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            success: false,
            message: "Please provide username and password!"
        });
        return;
    }

    try {
        const User = await UserModel.findOne({ username }).lean();
        if (!User) {
            res.status(404).json({
                success: false,
                message: "User not found."
            });
            return;
        }

        if (User.password != password) {
            res.status(403).json({
                success: false,
                message: "Wrong password."
            });
            return;
        }

        else {
            res.json({
                success: true,
                message: "Login success!",
                data: User
            });
            return;
        }
    }

    catch(err) {
        res.status(500).status({
            success: false,
            error: err,
            message: "Internal server error."
        });
        return;
    }
});

router.post("/update_username", async (req, res) => {
    const { username, password, new_username } = req.body;

    if (!username || !password || !new_username) {
        res.status(400).json({
            success: false,
            message: "Please provide username, password, and new_username!"
        });
        return;
    }

    try {
        const user = await UserModel.findOne({ username }).lean();
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found!"
            });
            return;
        }

        if (user.password != password) {
            res.status(403).json({
                success: false,
                message: "Wrong password!"
            });
            return;
        }

        const userWithNewUsername = await UserModel.findOne({ username: new_username });
        if (userWithNewUsername) {
            res.status(400).json({
                success: false,
                message: `User with username "${new_username}" already exists.`
            });
            return;
        }

        const updateRequest = await UserModel.findOneAndUpdate({ username }, { username: new_username });
        res.json({
            success: true,
            message: "Update username success!",
            data: {
                username: new_username,
                email: user.email
            }
        });
        return;
    }

    catch(err) {
        res.status(500).status({
            success: false,
            error: err,
            message: "Internal server error."
        });
        return;
    }
});

router.post('/update_password', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        res.status(400).json({
            success: false,
            message: "Please provide username!"
        });
        return;
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found!"
        });
        return;
    }
});

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
    
//     // verify if request have username and password on body
//     if (!username || !password) {
//         return res.status(400).send({ success: false, message: "Please provice username and password!" });
//     }

//     try {
//         const conn = database.getDb();
//         const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

//         // verify if username exists
//         if (!users.length) return res.status(403).send({ success: false, message: "User not found!" });

//         // verify password
//         if (password == users[0].password) {
//             return res.send({ success: true, data: users[0], message: "Login success!" });
//         }
//         else {
//             return res.status(403).send({ success: false, message: "Wrong password!" });
//         }
//     }

//     catch(err) {
//         res.status(500).send({ success: false, error: err });
//     }
// });

// router.post('/updateUsername', async (req, res) => {
//     const { username, password, new_username } = req.body;

//     // verify if request body have username, password, and new username
//     if (!username || !password || !new_username) {
//         return res.status(400).send({ success: false, message: "Please provide complete data" });
//     }

//     try {
//         const conn = database.getDb();
//         const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

//         // verify if username exists
//         if (!users.length) {
//             return res.status(403).send({ success: false, message: "Wrong username" });;
//         }

//         // verify if password is correct
//         if (password != users[0].password) {
//             return res.status(403).json({ success: false, message: "Wrong password" });
//         }

//         try {
//             // updating username
//             const update_query = await conn.query(`UPDATE user SET username="${new_username}" WHERE username="${username}"`);
//             const new_user = { id: users[0].id, username: new_username }
//             return res.json({ success: true, data: new_user, message: "Username updated!" });
//         }
//         catch(err) {
//             return res.status(500).json({ success: false, message: "Failed update username", error: err });
//         }
//     }

//     catch(err) {
//         return res.status(500).send({ success: false, error: err });
//     }
// });

// router.post('/updatePassword', async (req, res) => {
//     const { username, password, new_password } = req.body;

//     // verify if request body have username, password, and new password
//     if (!username || !password || !new_password) {
//         return res.status(400).json({ success: false, message: "Please provide complete data" });
//     }

//     try {
//         const conn = database.getDb();
//         const users = await conn.query(`SELECT * FROM user WHERE username="${username}"`);

//         // verify if username is exists
//         if (!users.length) return res.status(403).json({ success: false, message: "Wrong username" });

//         // verify if password is correct
//         if (password != users[0].password) return res.status(403).json({ success: false, message: "Wrong old password!" });
        
//         try {
//             // updating password
//             const update_query = await conn.query(`UPDATE user SET password="${new_password}" WHERE username="${username}"`);
//             return res.json({ success: true, message: "Password updated!" });
//         }
//         catch (err) {
//             return res.status(500).json({ success: false, error: err });
//         }
//     }
//     catch (err) {
//         return res.status(500).json({ success: false, error: err });
//     }
// });

// router.post('/insertUser', async (req, res) => {
//     const { username, password } = req.body;

//     // validating if username and password exists in request body
//     if (!username || !password) {
//         return res.status(400).json({ success: false, message: "Please provide complete data" });
//     }

//     try {
//         const conn = database.getDb();

//         // check if username already exists
//         const users = await conn.query(`SELECT username FROM user WHERE username="${username}"`);
//         if (users.length) {
//             return res.status(403).json({ success: false, message: "Username already exists." });
//         }

//         // insert new user into database
//         const insertRequest = await conn.query(`INSERT INTO user (username, password) VALUES ("${username}", "${password}")`);
//         return res.json({ success: true, message: "Success inserting user!", data: insertRequest });
//     }
//     catch (err) {
//         return res.status(500).json({ success: false, error: err });
//     }
// })

module.exports = router;
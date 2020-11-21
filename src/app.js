const express = require('express');
const cors = require('cors');
const parser = require('body-parser');

const userRoutes = require('./routes/UserRoutes');
const database = require('./configs/Mysql');

const app = express();

app.use(cors());
app.use(parser.json());

database.initDb();

app.get('/', (req, res) => {
    res.send({ message: "Hello, world!" });
});

app.use('/user', userRoutes);

app.listen(3000, () => console.log("Listening to port 3000"));

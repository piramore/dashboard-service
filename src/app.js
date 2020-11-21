const express = require('express');
const cors = require('cors');
const parser = require('body-parser');

const connection = require('./configs/Mongo');
const userRoutes = require('./routes/UserRoutes');

const app = express();
app.use(cors());
app.use(parser.json());

connection();

app.get('/', (req, res) => {
    res.send({ message: "Hello, world!" });
});

app.use('/user', userRoutes);

app.listen(3000, () => console.log("Listening to port 3000"));

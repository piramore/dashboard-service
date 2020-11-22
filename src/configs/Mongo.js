const mongoose = require('mongoose');

const MONGO_HOST = "localhost:27017";
const MONGO_DB = "dashboard-kuli";
const MONGO_USER = "";
const MONGO_PASSWORD = "";

const connectionString = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

const connect = () => {
    let mongoConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }

    if (MONGO_USER && MONGO_PASSWORD) {
        Object.assign(mongoConfig, {
            authSource: "admin",
            auth: {
                user: MONGO_USER,
                password: MONGO_PASSWORD
            }
        })
    }

    mongoose.connect(connectionString, mongoConfig, err => {});
    const connection = mongoose.connection;

    connection.on('connected', () => console.log("Database connected!"));
    connection.on('disconnected', () => console.log("Disconnected from database."));
    connection.on('error', (err) => {
        console.log("Failed connecting to database.");
        console.log(err);
    });
    
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log("Disconnecting from database.");
            process.exit(0);
        })
    })
}

module.exports = connect;
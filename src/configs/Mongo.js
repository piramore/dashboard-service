const mongoose = require('mongoose');

const connectionString = "mongodb://localhost:27017/dashboard-kuli";

const connect = () => {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, err => {});

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
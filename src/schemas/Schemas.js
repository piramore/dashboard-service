const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const UserModel = mongoose.model("User", UserSchema, "user");

module.exports = { UserModel }
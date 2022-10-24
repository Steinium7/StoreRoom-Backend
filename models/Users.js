const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 7,
    },
    phone: {
        type: Number,
        minlength: 10,
        maxlength: 14,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    NumofShops: {
        type: Number,
        default: 0,
    },
    Shops: {
        type: Array,
        default: [],
    },
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, config.get('jwtKey'));
};

const User = mongoose.model('users', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const User = mongoose.model(
    'users',
    new mongoose.Schema({
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
    })
);

module.exports = User;

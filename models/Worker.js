const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        minLenght: 10,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        minlength: 10,
        maxlength: 14,
        required: true,
    },
    assignedShop: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['worker', 'manager'],
        required: true,
        default: 'worker',
    },
});

workerSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, config.get('jwtKey'));
};

const Worker = mongoose.model('workers', workerSchema);

module.exports = Worker;

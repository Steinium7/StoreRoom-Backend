const mongoose = require('mongoose');

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
    AssignedShop: {
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

const Worker = mongoose.model('workers', workerSchema);

module.exports = Worker;

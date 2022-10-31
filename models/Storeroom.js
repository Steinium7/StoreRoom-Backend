const mongoose = require('mongoose');

const storeroomSchema = new mongoose.Schema({
    manager: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    Numofworkers: {
        type: Number,
        default: 0,
    },
});

const storeroomInventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    packMethod: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
});

const generateStoreroomInv = function (storeRoomName) {
    return mongoose.model(storeRoomName, storeroomInventorySchema);
};

const Storeroom = mongoose.model('storeroom', storeroomSchema);

module.exports = { Storeroom, generateStoreroomInv };

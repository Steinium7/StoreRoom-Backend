const mongoose = require('mongoose');

const storeroomNameSchema = new mongoose.Schema({
    manager: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        minlength: 8,
        default: 'storeroom1',
    },
    location: {
        type: String,
        required: true,
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

storeroomNameSchema.methods.generateStoreroomInv = function (storeRoomName) {
    return mongoose.model(storeRoomName, storeroomInventorySchema);
};

const Storeroom = mongoose.model('storeroom', storeroomNameSchema);

module.exports = Storeroom;

const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { Storeroom } = require('../models/Storeroom');

module.exports.create = async (req, res) => {
    let storeroom = await Storeroom.find({ name: req.body.name });

    if (storeroom.length != 0) {
        return res
            .status(400)
            .send({ err: 'Storeroom already exists or name is taken' });
    }
    storeroom = new Storeroom({
        name: req.body.name,
        manager: req.body.manager,
        location: req.body.location,
    });
    storeroom = await storeroom.save();

    return res.status(201).send(_.pick(storeroom, ['name']));
};

module.exports.all = async (req, res) => {
    let data = await Storeroom.find({});
    res.status(200).send(data);
};

module.exports.getbyId = async (req, res) => {
    let storeroom = await Storeroom.findById(new ObjectId(req.params.id));
    if (!storeroom) return res.status(404).send({ err: 'Storeroom not found' });

    return res.status(200).send(storeroom);
};

module.exports.updatebyId = async (req, res) => {
    let storeroom = await Storeroom.findByIdAndUpdate(
        new ObjectId(req.params.id),
        req.body,
        {
            new: true,
        }
    );
    if (!storeroom) return res.status(404).send({ err: 'Storeroom not found' });

    return res.status(200).send(storeroom);
};

module.exports.deletebyId = async (req, res) => {
    let storeroom = await Storeroom.findByIdAndDelete(
        new ObjectId(req.params.id)
    );
    if (!storeroom) return res.status(404).send({ err: 'Storeroom not found' });

    return res.status(200).send({ msg: 'Deleted' });
};

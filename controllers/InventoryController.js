const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { generateStoreroomInv } = require('../models/Storeroom');

module.exports.create = async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);

    let inventory = await Inventory.find({ name: req.body.name });
    if (inventory.length != 0) {
        return res
            .status(400)
            .send({ err: 'Item already exists or name is taken' });
    }
    item = new Inventory({
        name: req.body.name,
        amount: req.body.amount,
        number: req.body.number,
        packMethod: req.body.packMethod,
    });

    item = await item.save();

    return res.status(201).send(_.pick(item, ['name']));
};

module.exports.all = async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);
    let data = await Inventory.find({});
    res.status(200).send(data);
};

module.exports.getbyId = async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);
    let inventory = await Inventory.findById(new ObjectId(req.params.id));
    if (!inventory) return res.status(404).send({ err: 'Item not found' });

    return res.status(200).send(inventory);
};

module.exports.updatebyId = async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);

    let inventory = await Inventory.findByIdAndUpdate(
        new ObjectId(req.params.id),
        req.body,
        {
            new: true,
        }
    );
    if (!inventory) return res.status(404).send({ err: 'Item not found' });

    return res.status(200).send(inventory);
};

module.exports.deletebyId = async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);

    let inventory = await Inventory.findByIdAndDelete(
        new ObjectId(req.params.id)
    );
    if (!inventory) return res.status(404).send({ err: 'Item not found' });

    return res.status(200).send({ msg: 'Deleted' });
};

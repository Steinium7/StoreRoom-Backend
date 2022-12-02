const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { generateStoreroomInv } = require('../models/Storeroom');
const manager = require('../middleware/manager');
const auth = require('../middleware/auth');
const worker = require('../middleware/worker');
const router = express.Router();
const _ = require('lodash');

router.post('/create/:store', auth, worker, async (req, res) => {
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
});

router.get('/all/:store', auth, manager, async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);
    let data = await Inventory.find({});
    res.status(200).send(data);
});

//adding number of items to be resolved
router.get('/:id/:store', auth, manager, async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);
    let inventory = await Inventory.findById(new ObjectId(req.params.id));
    if (!inventory) return res.status(404).send({ err: 'Item not found' });

    return res.status(200).send(inventory);
});

router.patch('/:id/:store', auth, worker, async (req, res) => {
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
});

router.delete('/:id/:store', auth, manager, async (req, res) => {
    let Inventory = generateStoreroomInv(req.params.store);

    let inventory = await Inventory.findByIdAndDelete(
        new ObjectId(req.params.id)
    );
    if (!inventory) return res.status(404).send({ err: 'Item not found' });

    return res.status(200).send({ msg: 'Deleted' });
});

module.exports = router;

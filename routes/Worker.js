const express = require('express');
const Worker = require('../models/Worker');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const manager = require('../middleware/manager');
const auth = require('../middleware/auth');
const ObjectId = mongoose.Types.ObjectId;
const _ = require('lodash');

const router = express.Router();

router.get('/all', auth, manager, async (req, res) => {
    let data = await Worker.find({});
    data.reduce((a) => {
        return _.omit(a, ['password']);
    });
    res.status(200).send(data);
});

router.get('/:id', auth, manager, async (req, res) => {
    let worker = await Worker.findById(new ObjectId(req.params.id));
    if (!worker) return res.status(404).send({ err: 'Worker not found' });

    return res.status(200).send(_.omit(worker, ['password']));
});

// To correct later
router.patch('/:id', auth, manager, async (req, res) => {
    let worker = await Worker.findByIdAndUpdate(
        new ObjectId(req.params.id),
        req.body,
        {
            new: true,
        }
    );
    if (!worker) return res.status(404).send({ err: 'Worker not found' });

    return res.status(200).send(_.omit(worker, ['password']));
});

router.delete('/:id', auth, manager, async (req, res) => {
    let worker = await Worker.findByIdAndDelete(new ObjectId(req.params.id));
    if (!worker) return res.status(404).send({ err: 'Worker not found' });

    return res.status(200).send({ msg: 'Deleted' });
});

router.post('/signup/:id', async (req, res) => {
    let worker = await Worker.findOne({ email: req.body.email });
    if (worker) return res.status(400).send({ err: 'Email Already Exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    let newWorker = req.body.role
        ? new Worker({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              assignedShop: req.params.id,
              role: req.body.role,
              password: hash,
          })
        : new Worker({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              assignedShop: req.params.id,
              password: hash,
          });

    newWorker = await newWorker.save();
    return res.status(201).send(_.pick(newWorker, ['name', 'email']));
});

router.post('/login', async (req, res) => {
    let worker = await Worker.findOne({ email: req.body.email });
    if (!worker) return res.status(400).send({ err: 'Worker does not exist' });

    const result = await bcrypt.compare(req.body.password, worker.password);
    if (!result) return res.status(400).send({ err: 'Invalid Credentials' });

    // token
    let token = worker.generateToken();
    res.status(200).send(token);
});

module.exports = router;

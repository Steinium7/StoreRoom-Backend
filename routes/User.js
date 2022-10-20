const express = require('express');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const router = express.Router();

router.post('/signup', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ err: 'Email Already Exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
    });

    newUser = await newUser.save();
    return res.status(201).send(_.pick(newUser, ['name', 'email']));
});

router.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ err: 'User does not exist' });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send({ err: 'Invalid Credentials' });

    let token = user.generateToken();
    res.status(200).send(token);
});

module.exports = router;

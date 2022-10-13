const express = require('express');
const User = require('../models/Users');

const router = express.Router();

router.post('/signup', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.sendStatus(400).send('Email Already Exists');

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });
    newUser = await newUser.save();

    return res.send(newUser); //.sendStatus(200);
});

module.exports = router;

const User = require('../models/Users');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const _ = require('lodash');

const ObjectId = mongoose.Types.ObjectId;

module.exports.all = async (req, res) => {
    let data = await User.find({});
    data.reduce((a) => {
        return _.omit(a, ['password']);
    });
    res.status(200).send(data);
};

module.exports.getbyId = async (req, res) => {
    let user = await User.findById(new ObjectId(req.params.id));
    if (!user) return res.status(404).send({ err: 'User not found' });

    return res.status(200).send(_.omit(user, ['password']));
};

module.exports.updatebyId = async (req, res) => {
    let user = await User.findByIdAndUpdate(
        new ObjectId(req.params.id),
        req.body,
        {
            new: true,
        }
    );
    if (!user) return res.status(404).send({ err: 'User not found' });

    return res.status(200).send(_.omit(user, ['password']));
};

module.exports.deletebyId = async (req, res) => {
    let user = await User.findByIdAndDelete(new ObjectId(req.params.id));
    if (!user) return res.status(404).send({ err: 'User not found' });

    return res.status(200).send({ msg: 'Deleted' });
};

module.exports.signup = async (req, res) => {
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
};

module.exports.login = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ err: 'User does not exist' });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send({ err: 'Invalid Credentials' });

    let token = user.generateToken();
    res.status(200).send({ access_token: token });
};

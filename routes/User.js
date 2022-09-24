const express = require('express')
const User = require('../models/Users')

const router = express.Router();

router.post('/signup',async (req, res) => {
    // console.log(req.body)
    let user = await User.find({email : req.body.email})
    if (user) return res.sendStatus(400).send('Email Already Exists')

    let newUser = new User({name:req.body.name, email:req.body.email, number:req.body.number})
    newUser.save();
    
});


module.exports = router;

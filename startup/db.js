const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test').then(()=>console.log("connected to Db"))
.catch((err)=>console.log(err))

module.exports = mongoose
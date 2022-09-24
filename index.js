const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const user = require('./routes/User.js')

const app = express()
app.use(express.json())
app.use('/api/user', user)


mongoose.connect('mongodb://localhost/test').then(()=>console.log("connected to Db"))
.catch((err)=>console.log(err))


app.get('/', (req, res)=>{
    res.send({data: 'data'})
}) 

app.listen(5000, ()=> console.log("listening on port 5000"))
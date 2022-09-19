const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('').then(()=>console.log("connected to Db"))
.catch((err)=>console.log(err))


app.get('/', (req, res)=>{
    res.send({data: 'data'})
})

app.listen(5000, ()=> console.log("listening on port 5000"))
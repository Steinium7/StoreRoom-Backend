import express from "express";
import config from 'config'
import mongoose from "mongoose";
const user = require('./routes/User.js')

const app = express()
app.use(cors())
app.use(json())
app.use(user, '/api/user')


mongoose.connect('mongodb://localhost/test').then(()=>console.log("connected to Db"))
.catch((err)=>console.log(err))


app.get('/', (req, res)=>{
    res.send({data: 'data'})
}) 

app.listen(5000, ()=> console.log("listening on port 5000"))
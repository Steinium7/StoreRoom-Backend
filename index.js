const express = require('express')
const config = require('config')

const app = express()

app.get('/', (req, res)=>{
    res.send({data: 'data'})
})

app.listen(5000, ()=> console.log("listening on port 5000"))
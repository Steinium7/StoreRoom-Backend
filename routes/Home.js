const express = require('express')
const router = express.Router()


router.get('/', (req, res)=>{
    res.send({data: '1'})
}) 


module.exports = router
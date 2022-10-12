// import bcrypt from 'bcrypt'
const bcrypt = require('bcrypt')

async function home(){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash('homelander',salt)

    const result = await bcrypt.compare('homeander', hash)
    return result
}

home().then((x)=>{
    console.log(x)
})

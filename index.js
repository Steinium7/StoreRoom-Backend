const express = require('express')
const config = require('config')
const user = require('./routes/User.js')
const home = require('./routes/Home')

const app = express()
app.use(express.json())
app.use('/api/user', user)
app.use('/api/home', home)

if (config.get('env') == 'production')
    require('./startup/db')


port = process.env.PORT || 3000;
if (config.get('env') == 'production')
    app.listen(port, () => {
        // winston.info(`Listening on Port ${port}`);
    });

module.exports = app;
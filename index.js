const express = require('express');
const config = require('config');
// const winston = require('winston');
const user = require('./routes/User.js');
const home = require('./routes/Home');
const { main, logger } = require('./startup/logging');

const app = express();
main();
app.use(express.json());
app.use('/api/user', user);
app.use('/api/home', home);

if (config.get('env') != 'testing') {
    // logger = require('./startup/logging')();
    require('./startup/db');
}

port = process.env.PORT || 3000;

if (config.get('env') != 'test') {
    app.listen(port, () => {
        logger.info(`Listening on Port ${port}`);
    });
}
module.exports = app;

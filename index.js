require('express-async-errors');
const express = require('express');
const config = require('config');
const error = require('./middleware/error');
const user = require('./routes/User.js');
const worker = require('./routes/Worker');
const storeroom = require('./routes/Storeroom');
const inventory = require('./routes/Inventory');
const { uncaughtExceptions, logger } = require('./startup/logging');

const app = express();
uncaughtExceptions();
app.use(express.json());
app.use('/api/user', user);
app.use('/api/worker', worker);
app.use('/api/storeroom', storeroom);
app.use('/api/inventory', inventory);
app.use(error);

if (config.get('env') != 'test') {
    require('./startup/db');
    require('./startup/prod')(app);
}

port = process.env.PORT || 3000;

if (config.get('env') != 'test') {
    app.listen(port, () => {
        logger.info(`Listening on Port ${port}`);
    });
}
module.exports = app;

const mongoose = require('mongoose');
// const winston = require('winston');
const config = require('config');
const { _, logger } = require('../startup/logging');

if (config.get('env') == 'production') {
    mongoose
        .connect(
            `mongodb://${config.get('DB_USERNAME')}:${config.get(
                'DB_PASSWORD'
            )}@${config.get('DB_HOST')}:${config.get('DB_PORT')}/storeroom`
        )
        .then(() => logger.info('connected to Db -- Production'))
        .catch(async (err) => await logger.error(err.message));
}
if (config.get('env') == 'development') {
    mongoose
        .connect('mongodb://localhost/test')
        .then(() => logger.info('connected to Db -- dev'))
        .catch((err) => logger.error(err.message));
}

module.exports = mongoose;

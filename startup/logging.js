const { transports, createLogger, format } = require('winston');
const winston = require('winston');
const config = require('config');

const uncaughtExceptions = function () {
    process.on('uncaughtException', (ex) => {
        throw ex;
    });

    winston.exceptions.handle(
        new winston.transports.File({
            filename: 'logs/uncaughtException.log',
        }),
        { timestamp: true }
    );
};

const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new transports.File({
            filename: 'logs/info.log',
            level: 'info',
        }),
    ],
});

if (config.get('env') != 'production') {
    logger.remove(winston.transports.File);
}

module.exports = { uncaughtExceptions, logger };

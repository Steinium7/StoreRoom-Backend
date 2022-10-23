const { transports, createLogger, format } = require('winston');
const winston = require('winston');
const config = require('config');

const main = function () {
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

// if (config.get('env') == 'production') {
//     winston.add(
//         new winston.transports.File({
//             filename: 'error.log',
//             level: 'error',
//         }),
//         { timestamp: true }
//     );
//     winston.add(
//         new winston.transports.File({
//             filename: 'info.log',
//             level: 'info',
//         }),
//         { timestamp: true }
//     );
// }
// winston.remove(winston.transports.Console);
// winston.add(new winston.transports.Console(), { timestamp: true });
// .add(winston.Logform.format.timestamp());

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

module.exports = { main, logger };

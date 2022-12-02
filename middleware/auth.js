const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    try {
        let token = req.header('x-auth-token');
        const info = jwt.verify(token, config.get('jwtKey'));
        req.user = info;
        next();
    } catch (error) {
        return res.status(402).send({ err: 'Access denied, login' });
    }
};

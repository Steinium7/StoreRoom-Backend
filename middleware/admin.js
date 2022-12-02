module.exports = function (req, res, next) {
    const info = req.user;
    if (info.role != 'admin')
        return res
            .status(402)
            .send({ err: 'Unauthorized, this incident will be reported' });
    next();
};

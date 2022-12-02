const level = ['owner', 'manager', 'worker'];

module.exports = function (req, res, next) {
    const info = req.user;
    try {
        if (level.indexOf(info.role) <= level.indexOf('manager')) next();
        else return res.status(402).send({ err: 'Unauthoried' });
    } catch (error) {
        return res.status(402).send({ err: 'Unauthoried' });
    }
};

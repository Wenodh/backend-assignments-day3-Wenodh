const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res
            .status(403)
            .send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.SECRETE, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.',
            });
        }
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
};
exports.isAdmin = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) return res.status(404).send({ message: 'No user exist' });
        if (user.role != 'admin')
            return res
                .status(403)
                .send({ message: 'No access for other roles' });
        next();
    });
};

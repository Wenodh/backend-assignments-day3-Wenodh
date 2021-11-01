var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const User = require('../models/user.model');
exports.signup = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
    });

    await user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        } else {
            res.send({ message: 'User was registered successfully!' });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!',
            });
        }

        let token = jwt.sign({ id: user.id }, process.env.SECRETE, {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.role,
            accessToken: token,
        });
    });
};

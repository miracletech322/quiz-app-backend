const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

exports.loginAction = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const userData = await User.find({ username: username }).exec();

        if (userData.length === 0) {
            res.status(200).json({
                status: "not_exist",
            })
        } else {
            const hashedPassword = userData[0].password;
            const status = await bcrypt.compare(password, hashedPassword);
            if (status) {
                var token = jwt.encode(userData, '0xDbc23AE43a150ff8884B02Cea117b22D1c3b9796');

                res.status(200).json({
                    status: "success",
                    user: userData[0],
                    token: token
                })
            } else {
                res.status(200).json({
                    status: "wrong",
                })
            }
        }

    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}

exports.registerAction = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            username,
            role,
            password
        } = req.body;

        const existUsers = await User.find({ username });
        if (existUsers.length > 0) {
            res.status(200).json({
                status: "exist",
            })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordString = await bcrypt.hash(password, salt);
        const user = new User({
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: passwordString,
            role: role,
        });

        const userData = await user.save();
        res.status(200).json({
            status: "success",
            user: userData
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            message: e.message
        })
    }
}
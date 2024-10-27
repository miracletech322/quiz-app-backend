const express = require('express');
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get('/', function (req, res) {
    res.status(200).json({
        message: "This is API for user"
    })
});

router.post('/login', userController.loginAction);
router.post('/register', userController.registerAction);

module.exports = router;

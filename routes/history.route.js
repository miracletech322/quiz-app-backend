const express = require('express');
const router = express.Router();
const historyController = require("./../controllers/history.controller");

router.get('/', function (req, res) {
    res.status(200).json({
        message: "APIs for Histories"
    })
});

router.post('/read', historyController.readAction);

module.exports = router;

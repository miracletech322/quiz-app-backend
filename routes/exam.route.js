const express = require('express');
const router = express.Router();
const examController = require("./../controllers/exam.controller");

router.get('/', function (req, res) {
    res.status(200).json({
        message: "APIs for Examination"
    })
});

router.post('/read', examController.readAction);
router.post('/save', examController.saveAction);

module.exports = router;

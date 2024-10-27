const express = require('express');
const router = express.Router();
const courseController = require("./../controllers/course.controller");
const middleware = require("./../middlewares/auth.moddleware");

router.get('/', function (req, res) {
    res.status(200).json({
        message: "APIs for Course"
    })
});

router.post('/make-problem', [middleware.checkTeacher], courseController.makeProAction);
router.post('/delete', [middleware.checkTeacher], courseController.deleteAction);
router.post('/read-mine', [middleware.checkTeacher], courseController.readMineAction);

router.post('/read', courseController.readAction);

module.exports = router;

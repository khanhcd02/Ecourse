const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const verifyToken = require('../../middleware/checkToken');
// Route để bắt đầu bài thi
router.get('/:courseId/takeExam/:examId', verifyToken, examController.takeExam);

// Route để nộp bài thi
router.post('/:examId/submitExam', verifyToken, examController.submitExam);

module.exports = router;

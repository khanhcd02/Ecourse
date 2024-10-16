const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../../middleware/checkAdmin');
const jwt = require('jsonwebtoken');

router.get('/getReqTeacher', verifyAdmin, adminController.getReqTeacher);
router.get('/getReqCourse', verifyAdmin, adminController.getReqCourse);
router.get('/dashboard', verifyAdmin, adminController.dashboard);
router.get('/checkCourse/:Course_id', verifyAdmin, adminController.checkCourse);
router.get('/checkExam/:Exam_id', verifyAdmin, adminController.checkExam);
router.post('/resolveReqTeacher', verifyAdmin, adminController.resolveReqTeacher);
router.post('/resolveReqCourse', verifyAdmin, adminController.resolveReqCourse);

module.exports = router;
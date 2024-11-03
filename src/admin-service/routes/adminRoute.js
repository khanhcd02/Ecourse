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
router.get('/checkLesson/:Lesson_id', verifyAdmin, adminController.checkLesson);
router.post('/resolveReqTeacher', verifyAdmin, adminController.resolveReqTeacher);
router.post('/resolveReqCourse', verifyAdmin, adminController.resolveReqCourse);
router.get('/categories', verifyAdmin, adminController.getCategories);
router.post('/addCategory', verifyAdmin, adminController.addCategory);
router.post('/updateCategory', verifyAdmin, adminController.updateCategory);
router.post('/updateStatus', verifyAdmin, adminController.updateStatus);
module.exports = router;
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyTeacher = require('../../middleware/checkTeacher');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer'); // Nếu bạn sử dụng multer để xử lý file uploads

// Cấu hình multer để xử lý file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../static/img/courses/'); // Đường dẫn đến thư mục nơi bạn muốn lưu file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file
    }
});

const upload = multer({ storage: storage });
router.get('/', verifyTeacher, courseController.courses);
router.get('/addCourse', verifyTeacher, courseController.addCourses);
router.post('/addCourse', verifyTeacher,  upload.single('Image'), courseController.addCourses);
router.get('/addLesson/:courseId', verifyTeacher, courseController.addLesson);
router.post('/addLesson/:courseId', verifyTeacher, courseController.addLesson);
router.get('/:courseId', verifyTeacher, courseController.lessons);
router.get('/addExam/:courseId', verifyTeacher, courseController.addExam);
router.post('/addExam/:courseId', verifyTeacher, courseController.addExam);
router.get('/Exam/:examId', verifyTeacher, courseController.addExamDetail);
router.post('/Exam/:examId', verifyTeacher, courseController.addExamDetail);

module.exports = router;
